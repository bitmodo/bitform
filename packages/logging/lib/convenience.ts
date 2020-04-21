import { Level }       from './level';
import { Stringifier } from './output';
import { Logger }      from './logger';

/**
 *
 * @param stringifier
 */
export function logger(stringifier: Stringifier): Logger;

/**
 *
 * @param prefix
 * @param stringifier
 */
export function logger(prefix: string, stringifier?: Stringifier): Logger;

/**
 *
 * @param level
 * @param prefix
 * @param stringifier
 */
export function logger(level?: Level, prefix?: string, stringifier?: Stringifier): Logger;

export function logger(level?: Level | string | Stringifier, prefix?: string | Stringifier, stringifier?: Stringifier): Logger {
    if (level instanceof Level)
        return new Logger(level, prefix as string | undefined, stringifier);

    if (typeof level === 'string')
        return new Logger(level as string, prefix as Stringifier | undefined);

    if (typeof level === 'function')
        return new Logger(level as Stringifier);

    return new Logger();
}
