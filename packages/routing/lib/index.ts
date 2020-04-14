import { Request }           from '@bitform/request';
import { Response }          from '@bitform/Response';
import { Path as RoutePath } from '@bitform/routing-path';

/**
 *
 */
export enum Method {
    get     = 'get',
    post    = 'post',
    put     = 'put',
    delete  = 'delete',

    head    = 'head',
    connect = 'connect',
    options = 'options',
    trace   = 'trace',
    patch   = 'patch',
}

/**
 *
 */
export type Callback = (request: Request, response: Response) => void;

type Callbacks = { [method in Method]?: Callback };

/**
 *
 */
export abstract class Route {
    #path: RoutePath;
    #callbacks: Callbacks;

    protected constructor(path: RoutePath, callbacks?: Callbacks) {
        this.#path      = path;
        this.#callbacks = callbacks || {};
    }

    public get path(): RoutePath {
        return this.#path;
    }

    public set path(path: RoutePath) {
        this.#path = path;
    }

    public get callbacks(): Callbacks {
        return this.#callbacks;
    }

    public set callbacks(callbacks: Callbacks) {
        this.#callbacks = Object.assign(this.#callbacks, callbacks);
    }

    public add(method: Method, callback: Callback): this {
        this.#callbacks[method] = callback;

        return this;
    }

    public remove(method: Method): this {
        delete this.#callbacks[method];

        return this;
    }

    public removeAll(): this {
        this.#callbacks = {};

        return this;
    }

    public abstract handle(method: Method, request: Request, response: Response): void;
}

/**
 *
 */
export interface IRouter {
    route(method: Method | Method[], path: RoutePath, callback: Callback): Route;

    route(path: RoutePath): Route | undefined;

    all(path: RoutePath, callback: Callback): Route;

    get(path: RoutePath, callback: Callback): Route;

    post(path: RoutePath, callback: Callback): Route;

    put(path: RoutePath, callback: Callback): Route;

    delete(path: RoutePath, callback: Callback): Route;

    head(path: RoutePath, callback: Callback): Route;

    connect(path: RoutePath, callback: Callback): Route;

    options(path: RoutePath, callback: Callback): Route;

    trace(path: RoutePath, callback: Callback): Route;

    patch(path: RoutePath, callback: Callback): Route;
}

/**
 *
 */
export abstract class Router implements IRouter {
    public abstract route(method: Method | Method[], path: RoutePath, callback: Callback): Route;

    public abstract route(path: RoutePath): Route | undefined;

    public all(path: RoutePath, callback: Callback): Route {
        return this.route([Method.get, Method.post, Method.put, Method.delete, Method.head, Method.connect, Method.options, Method.trace, Method.patch], path, callback);
    }

    public connect(path: RoutePath, callback: Callback): Route {
        return this.route(Method.connect, path, callback);
    }

    public delete(path: RoutePath, callback: Callback): Route {
        return this.route(Method.delete, path, callback);
    }

    public get(path: RoutePath, callback: Callback): Route {
        return this.route(Method.get, path, callback);
    }

    public head(path: RoutePath, callback: Callback): Route {
        return this.route(Method.head, path, callback);
    }

    public options(path: RoutePath, callback: Callback): Route {
        return this.route(Method.options, path, callback);
    }

    public patch(path: RoutePath, callback: Callback): Route {
        return this.route(Method.patch, path, callback);
    }

    public post(path: RoutePath, callback: Callback): Route {
        return this.route(Method.post, path, callback);
    }

    public put(path: RoutePath, callback: Callback): Route {
        return this.route(Method.put, path, callback);
    }

    public trace(path: RoutePath, callback: Callback): Route {
        return this.route(Method.trace, path, callback);
    }
}
