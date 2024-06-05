import winston from 'winston';
import type { ILogger } from './loggerModel.js';

export class Logger implements ILogger {
    private pid: number;
    private logger: winston.Logger;
    private serviceName: string;
    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.pid = process.pid;
        this.logger = winston.createLogger({
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
    }
    error(msg: string): void {
        this.logger.error(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    warn(msg: string): void {
        this.logger.warn(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    info(msg: string): void {
        this.logger.info(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    http(msg: string): void {
        this.logger.http(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    verbose(msg: string): void {
        this.logger.verbose(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    debug(msg: string): void {
        this.logger.debug(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
    silly(msg: string): void {
        this.logger.silly(`(${this.pid}) ${this.serviceName}: ${msg}`);
    }
}