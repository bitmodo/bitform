import { Charset }     from '@bitform/charset';
import { ContentType } from '@bitform/content-type';
import { Cookie }      from '@bitform/cookie';
import { Encoding }    from '@bitform/encoding';
import { Language }    from '@bitform/language';
import { Method }      from '@bitform/method';

/**
 *
 */
export interface Request {
    baseUrl: string;
    body: string;
    cookies: Cookie[];
    fresh: boolean;
    fullUrl: string;
    hostname: string;
    ip: string;
    method: Method;
    path: string;
    protocol: 'http' | 'https';
    query: { [key: string]: string | string[] };
    secure: boolean;
    signedCookies: Cookie[];
    stale: boolean;
    subdomains: string[];
    xhr: boolean;

    accepts(...charsets: Charset[]): boolean;

    accepts(...types: ContentType[]): boolean;

    accepts(...encodings: Encoding[]): boolean;

    accepts(...languages: Language[]): boolean;

    header(name: string): string;

    header(name: string, value: string | string[] | undefined): this;
}

export default Request;
