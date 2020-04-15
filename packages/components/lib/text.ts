import { Attribute, Node, Component } from '@bitform/component';

/**
 *
 */
export interface TextConfig {
    tag?: string;
    id?: string;
    classes?: string | string[];
}

const defaultConfig: TextConfig = {
    tag:     undefined,
    id:      undefined,
    classes: undefined,
};

/**
 *
 */
export class Text extends Component {
    #text: string;

    #tag: string;
    #id?: string;
    #classes?: string | string[];

    public constructor(text: string, config?: TextConfig) {
        super();

        this.#text = text;

        config = {...config, ...defaultConfig};

        this.#tag     = config?.tag || 'span';
        this.#id      = config?.id;
        this.#classes = config?.classes;
    }

    public get text(): string {
        return this.#text;
    }

    public set text(text: string) {
        this.#text = text;
    }

    public get tag(): string {
        return this.#tag;
    }

    public set tag(tag: string) {
        this.#tag = tag;
    }

    public get id(): string | undefined {
        return this.#id;
    }

    public set id(id: string | undefined) {
        this.#id = id;
    }

    public get classes(): string | string[] | undefined {
        return this.#classes;
    }

    public set classes(classes: string | string[] | undefined) {
        this.#classes = classes;
    }

    get nodes(): Node[] {
        const text: Node = new Node(this.tag);

        if (this.id) {
            text.add(new Attribute('id', this.id));
        }

        if (this.classes) {
            let classes = this.classes;
            if (Array.isArray(classes)) {
                classes = classes.join(' ');
            }

            text.add(new Attribute('class', classes));
        }

        text.add(this.text);

        return [text];
    }
}
