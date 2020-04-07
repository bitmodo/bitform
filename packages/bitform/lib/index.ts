import { Module }   from '@bitform/module';
import { Provider } from '@bitform/provider';

/**
 *
 */
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
        this.#config = Object.assign(this.#config, config || defaultConfig);
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

    public run(): void {

    }
}

export default Bitform;
