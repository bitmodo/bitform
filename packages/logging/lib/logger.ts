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
export class Logger extends AbstractLogger {
    readonly #prefix: string;
    readonly #level: Level;
    #stringifier?: Stringifier;

    #outputs: LogOutput[] = [];

    public constructor(stringifier: Stringifier);
    public constructor(pre: string, stringifier?: Stringifier);
    public constructor(lvl?: Level, pre?: string, stringifier?: Stringifier);

    public constructor(lvl?: Stringifier | string | Level, pre?: string | Stringifier, stringifier?: Stringifier) {
        super();

        if (lvl instanceof Level) { // lvl is a Level
            this.#prefix      = (pre || '') as string;
            this.#level       = lvl || Level.info;
            this.#stringifier = stringifier;
        } else if (typeof lvl === 'function') { // lvl is a Stringifier
            this.#prefix      = '';
            this.#level       = Level.info;
            this.#stringifier = lvl as Stringifier;
        } else { // lvl is a prefix string or undefined
            this.#prefix      = (lvl || '') as string;
            this.#level       = Level.info;
            this.#stringifier = pre as Stringifier;
        }

        this.addOutput(new ConsoleOutput());
    }

    public get level(): Level {
        return this.#level;
    }

    public get prefix(): string {
        return this.#prefix;
    }

    public get outputs(): LogOutput[] {
        return this.#outputs;
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

    public addOutput(output: LogOutput) {
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
        this.#outputs.forEach((output: LogOutput) => { output.out(record.level, this.stringify(output, record)); });
    }

    private stringify(output: LogOutput, record: ILogRecord): string {
        if (output.stringify) {
            return output.stringify(record);
        }

        if (this.stringifier) {
            return this.stringifier(record);
        }

        return defaultStringifier(record);
    }
}
