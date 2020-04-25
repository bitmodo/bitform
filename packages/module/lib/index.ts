/**
 *
 */
export abstract class Module {
    readonly #name: string;

    protected constructor(name: string) {
        this.#name = name;
    }

    public get name(): string {
        return this.#name;
    }

    public preLoad?(): void;

    public load?(): void;

    public postLoad?(): void;
}

export default Module;
