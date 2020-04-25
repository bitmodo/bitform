import { ContentType }                      from '@bitform/content-type';
import { Cookie, Options as CookieOptions } from '@bitform/cookie';
import { Encoding }                         from '@bitform/encoding';
import { StatusCode }                       from '@bitform/status-code';

/**
 *
 */
export interface Response {
    append(name: string, value?: string | string[]): this;

    attachment(filename?: string): this;

    cookie(cookie: Cookie): this;

    cookie(name: string, value: string, options?: CookieOptions): this;

    cookie(name: string, value: undefined): this;

    download(path: string, filename?: string, fn?: (err?: Error) => void): this;

    end(data?: string | Buffer, encoding?: Encoding): this;

    header(name: string): string;

    header(name: string, value: string | string[] | undefined): this;

    json(body?: JSON): this;

    jsonp(body?: JSON): this;

    links(links: { [rel: string]: string }): this;

    location(path: string): this;

    redirect(status: StatusCode, path: string): this;

    redirect(path: string): this;

    send(body: string | JSON | Buffer | StatusCode): this;

    status(code: StatusCode): this;

    type(type: ContentType): this;
}

export default Response;
