export class Property {
    #name: string;
    #value: string;

    public constructor(name: string, value: string) {
        this.#name = name;
        this.#value = value;
    }

    public get name(): string {
        return this.#name;
    }

    public set name(name: string) {
        this.#name = name;
    }

    public get value(): string {
        return this.#value;
    }

    public set value(value: string) {
        this.#value = value;
    }
}

export class Node {
    #tag: string;

    public constructor(tag: string) {
        this.#tag = tag;
    }

    public get tag(): string {
        return this.#tag;
    }

    public set tag(tag: string) {
        this.#tag = tag;
    }
}

export class Component {

}

export default Component;
