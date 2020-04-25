/**
 *
 */
export interface Cookie extends Options{
    name: string;
    value: string;
    // encode: ;
}

export interface Options {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
    signed?: boolean;
}

export default Cookie;
