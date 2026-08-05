export type TUserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type TUserStatus = "ACTIVE" | "BLOCKED";

export type TRegisterUser = {
    name: string;
    email: string;
    password: string;
    role: TUserRole;
};

export type TLoginUser = {
    email: string;
    password: string;
};

export type TUser = {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: TUserRole;
    userStatus?: TUserStatus;
    createdAt?: string;
    updatedAt?: string;
};