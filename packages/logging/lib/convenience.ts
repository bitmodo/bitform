import { LoggerConfig, Logger } from './logger';

export function logger(config?: LoggerConfig): Logger {
    return new Logger(config);
}

export let root: (config?: LoggerConfig) => Logger = (config?: LoggerConfig) => {
    const log = logger(config);

    root = () => {
        return log;
    };

    return log;
};
