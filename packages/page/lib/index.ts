/**
 * A page.
 *
 * This is the base type for pages. A page is a collection of components optionally paired with a layout. Pages can have
 * dynamic content, like a username for example.
 */
export abstract class Page {
    readonly #name: string;

    protected constructor(name: string) {
        this.#name = name;
    }

    public get name(): string {
        return this.#name;
    }

    public abstract handle(): void;
}

export default Page;
