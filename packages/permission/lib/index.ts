/**
 *
 */
export interface Permission<T> {
    namespace: string;
    name: string;
    description: string;
    type: new () => T;
    defaultValue: T;
}

/**
 *
 */
export interface PermissionValue<T> {
    namespace: string;
    name: string;
    value: T;
}

/**
 *
 */
export interface Role {
    id: number;
    name: string;
    permissions: PermissionValue<any>[];
}
