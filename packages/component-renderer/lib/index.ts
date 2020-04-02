import { Component } from '@bitform/component';

class RenderDataIterator implements Iterator<Component> {
    #position: number = 0;
    readonly #components: Component[];

    public constructor(components: Component[]) {
        this.#components = components;
    }

    next(): IteratorResult<Component> {
        const value = this.#components[this.#position++];
        return {done: this.#position == this.#components.length, value: value};
    }
}

/**
 * Data to pass to a render.
 *
 * This is data that is passed to a renderer to get rendered. The class itself is basically a wrapper around a
 * component array, but provides a useful add method and allows for extensions to provide custom functionality in the
 * data portion.
 */
export class RenderData implements Iterable<Component> {
    #components: Component[] = [];

    public constructor(components: Component[] = []) {
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

    [Symbol.iterator](): Iterator<Component> {
        return new RenderDataIterator(this.#components);
    }
}

/**
 * A completed render.
 *
 * This represents a fully completed render. Behind the scenes, it is an array of strings because it allows the most
 * functionality with the final data. Concatenating multiple strings is quicker if it is done using a string array, plus
 * it can be converted into a buffer fairly easily.
 */
export class Render {
    readonly #text: string[];

    public constructor(text: string[] = []) {
        this.#text = text;
    }

    public get array(): string[] {
        return this.#text;
    }

    public get string(): string {
        return this.#text.join('');
    }

    public get buffer(): Buffer {
        return Buffer.from(this.#text);
    }
}

/**
 * A component renderer.
 *
 * This will take components and convert them into a rendered format. The default functionality of this for Bitform is
 * to convert it into HTML. However, if a different format or result is desired, this class can be extended freely to
 * provide whatever functionality might be desired.
 */
export abstract class Renderer {
    public abstract render(data: RenderData): Render;
}

export default Renderer;
