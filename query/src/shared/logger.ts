import winston from 'winston';
import type { ILogger } from './loggerModel.js';

export function makeLoggerService(serviceName: string): ILogger {
    const pid = process.pid;
    const logger = winston.createLogger({
        level: 'verbose',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.colorize({ all: true })
            }),
            new winston.transports.File({ filename: 'app.log' })
        ]
    });
    return {
        error(msg: string): void {
            logger.error(`(${pid}) ${serviceName}: ${msg}`);
        },
        warn(msg: string): void {
            logger.warn(`(${pid}) ${serviceName}: ${msg}`);
        },
        info(msg: string): void {
            logger.info(`(${pid}) ${serviceName}: ${msg}`);
        },
        http(msg: string): void {
            logger.http(`(${pid}) ${serviceName}: ${msg}`);
        },
        verbose(msg: string): void {
            logger.verbose(`(${pid}) ${serviceName}: ${msg}`);
        },
        debug(msg: string): void {
            logger.debug(`(${pid}) ${serviceName}: ${msg}`);
        },
        silly(msg: string): void {
            logger.silly(`(${pid}) ${serviceName}: ${msg}`);
        },
    }
}