/**
 *
 */
export type FullName = {
    first: string;
    middle?: string;
    last: string;
};

/**
 *
 */
export interface UserInformation {
    email: string;
    roles: number[];
}

/**
 *
 */
export type UserMetadata = Partial<{
    name: FullName;
    username: string;
    dob: Date;
}>;

/**
 *
 */
export interface User {
    info: UserInformation;
    metadata?: UserMetadata;
}

export default User;
