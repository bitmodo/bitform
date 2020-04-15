import { Attribute, Node, IComponent, GenericComponentGroup } from '@bitform/component';

/**
 *
 */
export interface ListConfig {
    id?: string;
    classes?: string | string[];
    itemClasses?: string | string[];
}

const defaultConfig: ListConfig = {
    id:      undefined,
    classes: undefined,
    itemClasses: undefined,
};

/**
 *
 */
export abstract class List extends GenericComponentGroup {
    readonly #tag: string;
    readonly #config: ListConfig = defaultConfig;

    protected constructor(tag: string, config?: ListConfig, items?: IComponent[]) {
        super(items);

        this.#tag    = tag;
        this.#config = {...this.#config, ...(config || {})};
    }

    public get tag(): string {
        return this.#tag;
    }

    public get id(): string | undefined {
        return this.#config.id;
    }

    public get classes(): string | string[] | undefined {
        return this.#config.classes;
    }

    public get itemClasses(): string | string[] | undefined {
        return this.#config.itemClasses;
    }

    public get nodes(): Node[] {
        const list: Node = new Node(this.tag);

        if (this.id) {
            list.add(new Attribute('id', this.id));
        }

        if (this.classes) {
            let classes = this.classes;
            if (Array.isArray(classes)) {
                classes = classes.join(' ');
            }

            list.add(new Attribute('class', classes));
        }

        for (const item of this.items) {
            const li: Node = new Node('li');

            if (this.itemClasses) {
                let classes = this.itemClasses;
                if (Array.isArray(classes)) {
                    classes = classes.join(' ');
                }

                li.add(new Attribute('class', classes));
            }

            li.add(item.nodes);
        }

        return [list];
    }
}
