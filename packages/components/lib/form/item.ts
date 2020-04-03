import { Node, ComponentGroupItem } from '@bitform/component';

/**
 *
 */
export abstract class FormItem extends ComponentGroupItem {
    /**
     *
     */
    public abstract get id(): string | undefined;

    /**
     *
     */
    public abstract get name(): string | undefined;

    public abstract get nodes(): Node[];
}
