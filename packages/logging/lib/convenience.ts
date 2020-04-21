import { LoggerConfig, Logger }      from './logger';

export function logger(config?: LoggerConfig): Logger {
    return new Logger(config);
}
