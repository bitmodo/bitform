import { Component } from '@bitform/component';

/**
 * A component parser.
 *
 * This will take some input that resembles components and parse it into the components API. The default functionality
 * is to parse a small HTML template syntax and convert that into the components API. If the default functionality is
 * not desired, this class is free to be extended to override the default functionality.
 */
export abstract class Parser {
    #parsed: boolean = false;
    #components: Component[] = [];

    public abstract parse(): void;

    private _parse(): void {
        if (this.#parsed) return;

        this.parse();
        this.#parsed = true;
    }

    public get components(): Component[] {
        this._parse();

        return this.#components;
    }
}

export default Parser;
