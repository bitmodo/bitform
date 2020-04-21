import { Level, LevelNames }                     from './level';
import { ILogRecord, LogRecord }                 from './record';
import { Stringifier, LogOutput, ConsoleOutput } from './output';

import { timestamp, prefix, level, format } from './util';

/**
 *
 */
export type StringLogger = {
    [lvl in LevelNames]: (message: string) => ILogRecord;
};

/**
 *
 */
export type ErrorLogger = {
    [lvl in LevelNames]: (err: Error, message: string) => ILogRecord;
};

/**
 *
 */
export type ObjectLogger = {
    [lvl in LevelNames]: (...objects: unknown[]) => ILogRecord;
};

/**
 *
 */
export abstract class AbstractLogger implements StringLogger, ErrorLogger, ObjectLogger {
    public debug: ((message: string) => ILogRecord) & ((err: Error, message: string) => ILogRecord) & ((...objects: unknown[]) => ILogRecord)  = this.impl(Level.debug);
    public info: ((message: string) => ILogRecord) & ((err: Error, message: string) => ILogRecord) & ((...objects: unknown[]) => ILogRecord)   = this.impl(Level.info);
    public warn: ((message: string) => ILogRecord) & ((err: Error, message: string) => ILogRecord) & ((...objects: unknown[]) => ILogRecord)   = this.impl(Level.warn);
    public error: ((message: string) => ILogRecord) & ((err: Error, message: string) => ILogRecord) & ((...objects: unknown[]) => ILogRecord)  = this.impl(Level.error);
    public severe: ((message: string) => ILogRecord) & ((err: Error, message: string) => ILogRecord) & ((...objects: unknown[]) => ILogRecord) = this.impl(Level.severe);

    public abstract log(level: Level, err: Error, message: string): ILogRecord;
    public abstract log(level: Level, message: string): ILogRecord;
    public abstract log(level: Level, ...objects: unknown[]): ILogRecord;

    private impl(lvl: Level): (...args: unknown[]) => ILogRecord {
        return (...args: unknown[]) => {
            return this.log(lvl, ...args);
        };
    }
}

const defaultStringifier: Stringifier = (record: ILogRecord) => {
    return format(record, timestamp(record), prefix(record), level(record));
};

/**
 *
 */
export interface LoggerConfig {
    prefix?: string;
    level?: Level;
    stringifier?: Stringifier;
}

/**
 *
 */
export class Logger extends AbstractLogger {
    readonly #parent?: Logger;

    readonly #prefix: string;
    readonly #level: Level;
    #stringifier?: Stringifier;

    #outputs: LogOutput[] = [];

    public constructor(config?: LoggerConfig);
    public constructor(parent?: Logger, config?: LoggerConfig);

    public constructor(parent?: Logger | LoggerConfig, config?: LoggerConfig) {
        super();

        let p: Logger | undefined, c: LoggerConfig | undefined;
        if (parent instanceof Logger) {
            p = parent;
            c = config;
        } else {
            p = undefined;
            c = parent;
        }

        this.#parent      = p;
        this.#prefix      = c?.prefix ?? '';
        this.#level       = c?.level ?? Level.info;
        this.#stringifier = c?.stringifier;

        this.addOutput(new ConsoleOutput());
    }

    public get level(): Level {
        return this.#level;
    }

    public get prefix(): string {
        return this.#prefix;
    }

    public get outputs(): LogOutput[] {
        return this.#outputs.concat(this.#parent?.outputs || []);
    }

    public set outputs(outputs: LogOutput[]) {
        this.#outputs = outputs;
    }

    public get stringifier(): Stringifier | undefined {
        return this.#stringifier;
    }

    public set stringifier(stringifier: Stringifier | undefined) {
        this.#stringifier = stringifier;
    }

    public child(config?: LoggerConfig): Logger {
        return new Logger({
            prefix:      this.prefix,
            level:       this.level,
            stringifier: this.stringifier,

            ...config,
        });
    }

    public addOutput(output: LogOutput) {
        if (!this.outputs.includes(output))
            this.#outputs.push(output);
    }

    public log(level: Level, err: Error, message: string): ILogRecord;
    public log(level: Level, message: string): ILogRecord;
    public log(level: Level, ...objects: unknown[]): ILogRecord;

    public log(lvl: Level, ...args: unknown[]): ILogRecord | undefined {
        if (lvl < this.level)
            return undefined;

        if (args.length === 2 && args[0] instanceof Error && typeof args[1] === 'string') {
            return this.logError(lvl, args[0], args[1]);
        }

        if (args.length === 1 && typeof args[0] === 'string') {
            return this.logMessage(lvl, args[0]);
        }

        return this.logObjects(lvl, ...args);
    }

    private logMessage(lvl: Level, message: string | string[]): ILogRecord {
        const record: ILogRecord = new LogRecord(lvl, this.prefix, message);
        this.out(record);
        return record;
    }

    private logError(lvl: Level, err: Error, message: string): ILogRecord {
        const messages: string[] = [message];
        if (err.stack) {
            err.stack.split('\n').forEach((line: string) => messages.push(line));
        }

        return this.logMessage(lvl, messages);
    }

    private logObjects(lvl: Level, ...objects: unknown[]): ILogRecord {
        return this.logMessage(lvl, `${objects.map((object) => typeof object === 'undefined' ? 'undefined' : (object ?? 'null')).join(', ')}`);
    }

    private out(record: ILogRecord) {
        this.outputs.forEach((output: LogOutput) => { output.out(record.level, this.stringify(output, record)); });
    }

    private stringify(output: LogOutput, record: ILogRecord): string {
        if (output.stringify) {
            return output.stringify(record);
        }

        if (this.stringifier) {
            return this.stringifier(record);
        }

        if (this.#parent && this.#parent.stringifier) {
            return this.#parent.stringifier(record);
        }

        return defaultStringifier(record);
    }
}
