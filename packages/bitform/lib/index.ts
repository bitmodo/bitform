import { Module }   from '@bitform/module';
import { Provider } from '@bitform/provider';

/**
 *
 */
// tslint:disable-next-line:no-empty-interface
export interface Config {

}

const defaultConfig: Config = {};

/**
 *
 */
export class Bitform {
    readonly #config: Config = defaultConfig;

    #provider?: Provider;
    #modules: Module[] = [];

    public constructor(config?: Config) {
        this.#config = {...this.#config, ...(config || defaultConfig)};
    }

    public get provider(): Provider | undefined {
        return this.#provider;
    }

    public get modules(): Module[] {
        return this.#modules;
    }

    public use(usable: Provider | Module): this {
        if (usable instanceof Provider) {
            this.#provider = usable;
        } else {
            this.#modules.push(usable);
        }

        return this;
    }

    // tslint:disable-next-line:no-empty
    public run(): void {

    }
}

export default Bitform;
