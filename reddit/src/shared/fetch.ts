import type { ILogger } from './loggerModel.js';

type fetchParams = Parameters<typeof fetch>;
type fetchInput = fetchParams[0];
type fetchInit = fetchParams[1];
type fetchReturn = ReturnType<typeof fetch>;

export function makeHttpService(logger: ILogger) {
    return {
        async fetch(input: fetchInput, init: fetchInit): fetchReturn {
            const response = await fetch(input, init);
            if (!response.ok) {
                throw new Error(
                    `Bad response code ${response.status} from fetch`,
                );
            }
            logger.info(`Successful fetch with status code ${response.status}`);
            return response;
        },
    };
}
