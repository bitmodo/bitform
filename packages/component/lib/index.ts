/**
 * A node attribute.
 *
 * This is a single attribute for a node. Properties have a name as well as a value and represent HTML tag attributes.
 * Attributes can be openly modified and have no actual meaning outside of the one that they are given. This means that
 * names and values won't be checked when parsing or rendering.
 */
export class Attribute {
    #name: string;
    #value: string;

    public constructor(name: string, value: string) {
        this.#name  = name;
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

/**
 * A node child.
 *
 * This is any type that a node child can be. Since nodes represent tags in HTML, node children can be any combination
 * of other nodes or text.
 */
export type NodeChild = Node | string;

/**
 * A component node.
 *
 * This is a single piece of a component. Nodes represent HTML tags and will be rendered directly to them. Nodes have no
 * extra checking, meaning that any tags and attributes won't actually be checked before they are rendered.
 */
export class Node {
    #tag: string;
    #attributes: Attribute[];
    #children: NodeChild[]

    public constructor(tag: string, attributes: Attribute[] = [], children: NodeChild[] = []) {
        this.#tag        = tag;
        this.#attributes = attributes;
        this.#children   = children;
    }

    public get tag(): string {
        return this.#tag;
    }

    public set tag(tag: string) {
        this.#tag = tag;
    }

    public get attributes(): Attribute[] {
        return this.#attributes;
    }

    public set attributes(attributes: Attribute[]) {
        this.#attributes = attributes;
    }

    public get children(): NodeChild[] {
        return this.#children;
    }

    public set children(children: NodeChild[]) {
        this.#children = children;
    }

    public add(item: (Attribute | NodeChild) | (Attribute | NodeChild)[]): this {
        if (Array.isArray(item)) {
            for (let element of item) {
                this.add(element);
            }
        } else {
            if (item instanceof Attribute) {
                this.#attributes.push(item);
            } else {
                this.#children.push(item);
            }
        }

        return this;
    }

    public getAttribute(name: string): Attribute | undefined {
        for (let attribute of this.#attributes) {
            if (attribute.name === name)
                return attribute;
        }

        return undefined;
    }

    public contains(item: Attribute): boolean {
        for (let attribute of this.#attributes) {
            if (attribute.name === item.name)
                return true;
        }

        return false;
    }
}

/**
 * The base component type.
 *
 * This is the most basic type a component could be. It contains all of the generic properties and methods that every
 * component should be able to provide.
 *
 * The reason for this interface is to allow a separation of different types of components while still having at least
 * one common ancestor. This makes it easy to separate things like regular components and component groups while still
 * allowing them to be rendered in the same fashion.
 *
 * Any class that extends this is responsible for also including any nodes that are in child components.
 */
export interface IComponent {
    nodes: Node[];
}

/**
 * A component.
 *
 * A component is a single part of a page. Components are meant to be as flexible and extensible as possible. That means
 * that they should be made to work with as many different configurations and values as possible.
 *
 * Components could represent anything on a page. That includes simple things such as containers as well as more complex
 * things like forms.
 */
export abstract class Component implements IComponent {
    public abstract get nodes(): Node[];
}

/**
 * A component group item.
 *
 * This is a single item in a component group. It should be fairly similar to a regular component, with the only exception
 * being that regular components cannot be used in the place of this type.
 */
export abstract class ComponentGroupItem implements IComponent {
    public abstract get nodes(): Node[];
}

/**
 * An abstract component group.
 *
 * This is a component list at its most basic form. It allows any type to be an item as long as the item implements
 * `IComponent`. This allows a regular component group to be made as well as a generic one that allows any component.
 */
export abstract class AbstractComponentGroup<T extends IComponent> extends Component {
    #items: T[];

    protected constructor(items: T[] = []) {
        super();

        this.#items = items;
    }

    public abstract get nodes(): Node[];

    public get items(): T[] {
        return this.#items;
    }

    public set items(items: T[]) {
        this.#items = items;
    }

    public add(...items: (T | T[])[]): this {
        for (let item of items) {
            if (Array.isArray(item)) {
                this.add(item);
            } else {
                this.#items.push(item);
            }
        }

        return this;
    }
}

/**
 * A component group.
 *
 * This is a group of components that use a common format. This allows for things like forms to be made where each
 * separate input field has a common format without allowing any other component types to be included in the group.
 * That makes sure the group has pure items that all follow a single type.
 */
export abstract class ComponentGroup<T extends ComponentGroupItem> extends AbstractComponentGroup<T> {
    public abstract get nodes(): Node[];
}

/**
 * A generic component group.
 *
 * This is similar to a regular component group with the exception that any component can be an item. This allows for
 * more generalized component groups for things like lists that don't care what type the components are.
 */
export abstract class GenericComponentGroup extends AbstractComponentGroup<IComponent> {
    public abstract get nodes(): Node[];
}

export default Component;
