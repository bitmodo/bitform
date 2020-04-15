import { FormItem }                        from './item';
import { Attribute, Node, ComponentGroup } from '@bitform/component';

/**
 *
 */
export interface FormConfig {
    class?: string | string[];
    labelDivClass?: string | string[];
    labelClass?: string | string[];
    inputDivClass?: string | string[];
    inputClass?: string | string[];
}

const defaultConfig: FormConfig = {
    class:         undefined,
    labelDivClass: undefined,
    labelClass:    undefined,
    inputDivClass: undefined,
    inputClass:    undefined,
};

/**
 *
 */
export class Form extends ComponentGroup<FormItem> {
    readonly #config: FormConfig = defaultConfig;

    public constructor(config?: FormConfig, items?: FormItem[]) {
        super(items);

        this.#config = {...this.#config, ...(config || {})};
    }

    get nodes(): Node[] {
        const form = new Node('form');

        let formClass = this.#config.class;
        if (formClass) {
            if (Array.isArray(formClass)) {
                formClass = formClass.join(' ');
            }

            form.add(new Attribute('class', formClass));
        }

        for (const item of this.items) {
            form.add(this.item(item));
        }

        return [form];
    }

    private item(item: FormItem): Node {
        const div      = new Node('div');
        const labelDiv = this.labelDiv(item);
        const inputDiv = this.inputDiv(item);

        if (labelDiv) div.add(labelDiv);
        div.add(inputDiv);

        return div;
    }

    private labelDiv(item: FormItem): Node | undefined {
        if (!item.name) return undefined;

        const labelDiv = new Node('div');

        let labelDivClass = this.#config.labelDivClass;
        if (labelDivClass) {
            if (Array.isArray(labelDivClass)) {
                labelDivClass = labelDivClass.join(' ');
            }

            labelDiv.add(new Attribute('class', labelDivClass));
        }

        const label = this.label(item.name);
        labelDiv.add(label);

        return labelDiv;
    }

    private label(name: string): Node {
        const label = new Node('label');

        let labelClass = this.#config.labelClass;
        if (labelClass) {
            if (Array.isArray(labelClass)) {
                labelClass = labelClass.join(' ');
            }

            label.add(new Attribute('class', labelClass));
        }

        label.add(name);

        return label;
    }

    private inputDiv(item: FormItem): Node {
        const inputDiv = new Node('div');

        let inputDivClass = this.#config.inputDivClass;
        if (inputDivClass) {
            if (Array.isArray(inputDivClass)) {
                inputDivClass = inputDivClass.join(' ');
            }

            inputDiv.add(new Attribute('class', inputDivClass));
        }

        const input = this.input(item);
        inputDiv.add(input);

        return inputDiv;
    }

    private input(item: FormItem): Node[] {
        const inputs = item.nodes;

        let inputClass = this.#config.inputClass;
        if (inputClass) {
            if (Array.isArray(inputClass)) {
                inputClass = inputClass.join(' ');
            }

            for (const input of inputs) {
                const classes = input.getAttribute('class');
                if (classes) {
                    classes.value += ` ${inputClass}`;
                } else {
                    input.add(new Attribute('class', inputClass));
                }
            }
        }

        return inputs;
    }
}
