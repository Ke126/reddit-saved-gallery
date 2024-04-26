import winston from 'winston';
import type { ILogger } from './logger.models.js';

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

class MyLogger implements ILogger {
    private pid: number;
    private svcName: string;
    private logger: winston.Logger;

    constructor(pid: number, svcName: string, logger: winston.Logger) {
        this.pid = pid;
        this.svcName = svcName;
        this.logger = logger;
    }

    error(msg: string): void {
        this.logger.error(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    warn(msg: string): void {
        this.logger.warn(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    info(msg: string): void {
        this.logger.info(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    http(msg: string): void {
        this.logger.http(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    verbose(msg: string): void {
        this.logger.verbose(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    debug(msg: string): void {
        this.logger.debug(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
    silly(msg: string): void {
        this.logger.silly(`(${this.pid}) ${this.svcName}: ${msg}`);
    }
}

let loggerInstance: ILogger;
export default function getLogger(svcName: string): ILogger {
    if (!loggerInstance)
        loggerInstance = new MyLogger(process.pid, svcName, logger);
    return loggerInstance;
}
