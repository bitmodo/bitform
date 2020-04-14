import { IComponent, Attribute, Node, GenericComponentGroup } from '@bitform/component';

/**
 *
 */
export interface ContainerConfig {
    tag: string;
    id?: string;
    classes?: string | string[];
}

const defaultConfig: ContainerConfig = {
    tag:     'div',
    id:      undefined,
    classes: undefined,
};

/**
 *
 */
export class Container extends GenericComponentGroup {
    readonly #config: ContainerConfig = defaultConfig;

    public constructor(config?: ContainerConfig, items?: IComponent[]) {
        super(items);

        this.#config = Object.assign(this.#config, config || {});
    }

    public get tag(): string {
        return this.#config.tag;
    }

    public get id(): string | undefined {
        return this.#config.id;
    }

    public get classes(): string | string[] | undefined {
        return this.#config.classes;
    }

    public get nodes(): Node[] {
        let container: Node = new Node(this.tag);

        if (this.id) {
            container.add(new Attribute('id', this.id));
        }

        if (this.classes) {
            let classes = this.classes;
            if (Array.isArray(classes)) {
                classes = classes.join(' ');
            }

            container.add(new Attribute('class', classes));
        }

        for (let item of this.items) {
            container.add(item.nodes);
        }

        return [container];
    }
}
