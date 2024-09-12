import type { ILogger } from './loggerModel.js';

export function tryThriceWrapper<A extends unknown[], B>(
    logger: ILogger,
    func: (logger: ILogger, ...a: A) => Promise<B>,
) {
    return async (...arg: A) => {
        let timer = 1;
        while (true) {
            try {
                const output = await func(logger, ...arg);
                return output;
            } catch (err) {
                // throw after 3 failed attempts
                if (timer >= 4) {
                    logger.error('3 failed call attempts, aborting');
                    throw err;
                }
                logger.warn(`Retrying call in ${timer * 1000} seconds`);
                await new Promise((resolve) =>
                    setTimeout(resolve, timer * 1000),
                );
                timer *= 2;
            }
        }
    };
}
