import { ListConfig, List } from './index';
import { IComponent }       from '@bitform/component';

/**
 *
 */
export class UnorderedList extends List {
    public constructor(config?: ListConfig, items?: IComponent[]) {
        super('ul', config, items);
    }
}
