/* tslint:disable:member-ordering */

/**
 *
 */
export class Level {
    private static iterator: number = 0;

    public static readonly debug  = new Level('debug');
    public static readonly info   = new Level('info');
    public static readonly warn   = new Level('warn');
    public static readonly error  = new Level('error');
    public static readonly severe = new Level('severe');

    readonly #level: number;
    readonly #name: string;

    private constructor(name: string) {
        this.#level = Level.iterator++;
        this.#name  = name;
    }

    public get level(): number {
        return this.#level;
    }

    public get name(): string {
        return this.#name;
    }

    public toString(): string {
        return this.name;
    }

    public valueOf(): number {
        return this.level;
    }
}

export type LevelNames = ('debug' | 'info' | 'warn' | 'error' | 'severe');
