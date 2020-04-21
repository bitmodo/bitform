import { Level } from './level';

/**
 *
 */
export interface ILogRecord {
    timestamp: Date;
    level: Level;
    prefix: string;
    messages: string | string[];
}

/**
 *
 */
export class LogRecord implements ILogRecord {
    readonly #timestamp: Date;
    readonly #level: Level;
    readonly #prefix: string;
    readonly #messages: string | string[];

    public constructor(level: Level, prefix: string, messages: string | string[]) {
        this.#timestamp = new Date(Date.now());
        this.#level     = level;
        this.#prefix    = prefix;
        this.#messages  = messages;
    }

    public get timestamp(): Date {
        return this.#timestamp;
    }

    public get level(): Level {
        return this.#level;
    }

    public get prefix(): string {
        return this.#prefix;
    }

    public get messages(): string | string[] {
        return this.#messages;
    }
}
