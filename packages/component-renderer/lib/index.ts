import { Component } from '@bitform/component';

/**
 * A component renderer.
 *
 * This will take components and convert them into a rendered format. The default functionality of this for Bitform is
 * to convert it into HTML. However, if a different format or result is desired, this class can be extended freely to
 * provide whatever functionality might be desired.
 */
export abstract class Renderer {
    #components: Component[];

    #rendered: boolean = false;
    #text: string[] = [];

    protected constructor(components: Component[] = []) {
        this.#components = components;
    }

    public get components(): Component[] {
        return this.#components;
    }

    public set components(components: Component[]) {
        this.#components = components;
    }

    public add(...components: (Component | Component[])[]): void {
        for (let component of components) {
            if (Array.isArray(component)) {
                this.add(component);
            } else {
                this.#components.push(component);
            }
        }
    }

    public abstract render(): void;

    private _render(): void {
        if (this.#rendered) return;

        this.render();
        this.#rendered = true;
    }

    protected push(...text: (string | string[])[]): void {
        for (let item of text) {
            if (Array.isArray(item)) {
                this.push(item);
            } else {
                this.#text.push(item);
            }
        }
    }

    public get string(): string {
        this._render();

        return this.#text.join('');
    }

    public get buffer(): Buffer {
        this._render();

        return Buffer.from(this.#text);
    }
}

export default Renderer;
