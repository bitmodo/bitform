import { Level }          from './level';
import { problem, strip } from './colors';
import { ILogRecord }     from './record';
import { erroring }       from './util';

import { PathLike, appendFile } from 'fs';

/**
 *
 */
export type Stringifier = (record: ILogRecord) => string;

/**
 *
 */
export interface LogOutput {
    out(level: Level, message: string): void;

    stringify?(record: ILogRecord): string;
}

/**
 *
 */
export class FileOutput implements LogOutput {
    readonly #filename: PathLike | number;

    public constructor(filename: PathLike | number) {
        this.#filename = filename;
    }

    public get filename(): PathLike | number {
        return this.#filename;
    }

    public out(lvl: Level, msg: string): void {
        appendFile(this.filename, strip(msg), (err) => {
            if (!err) return;

            process.stderr.write(problem(`Could not append to file: ${this.filename}\n`));

            process.stderr.write(problem(`${err.name}: ${err.message}\n`));

            if (err.stack)
                process.stderr.write(problem(`${err.stack}\n`));
        });
    }
}

/**
 *
 */
export class ConsoleOutput implements LogOutput {
    #out: NodeJS.WriteStream;
    #err: NodeJS.WriteStream;

    public constructor(out: NodeJS.WriteStream = process.stdout, err: NodeJS.WriteStream = process.stderr) {
        this.#out = out;
        this.#err = err;
    }

    public get stdout(): NodeJS.WriteStream {
        return this.#out;
    }

    public set stdout(out: NodeJS.WriteStream) {
        this.#out = out;
    }

    public get stderr(): NodeJS.WriteStream {
        return this.#err;
    }

    public set stderr(err: NodeJS.WriteStream) {
        this.#err = err;
    }

    public out(lvl: Level, msg: string): void {
        if (erroring(lvl)) {
            this.stderr.write(msg);
        } else {
            this.stdout.write(msg);
        }
    }
}
