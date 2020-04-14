import { ListConfig, List } from './index';
import { IComponent }       from '@bitform/component';

/**
 *
 */
export class OrderedList extends List {
    public constructor(config?: ListConfig, items?: IComponent[]) {
        super('ol', config, items);
    }
}
