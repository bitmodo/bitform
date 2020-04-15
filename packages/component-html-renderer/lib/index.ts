import { Attribute, Node } from '@bitform/component';
import { Renderer, RenderData, Render } from '@bitform/component-renderer';

/**
 *
 */
export class HTMLRenderer extends Renderer {
    public render(data: RenderData): Render {
        const render: string[] = [];

        for (const component of data) {
            for (const node of component.nodes) {
                render.push(this.renderNode(node));
            }
        }

        return new Render(render);
    }

    private renderNode(node: Node): string {
        let str: string = '';

        str += `<${node.tag}`;

        if (node.attributes.length > 0) {
            for (const attribute of node.attributes) {
                str += ` ${attribute.name}=${this.attributeValueString(attribute)}`;
            }

            str += ' ';
        }

        if (node.children.length <= 0) {
            str += '/>';
        } else {
            str += '>';

            for (const child of node.children) {
                if (child instanceof Node) {
                    str += this.renderNode(child);
                } else {
                    str += child;
                }
            }

            str += `</${node.tag}>`;
        }

        return str;
    }

    // noinspection JSMethodCanBeStatic
    private attributeValueString(attribute: Attribute): string {
        return `"${attribute.value}"`;
    }
}

export default HTMLRenderer;
