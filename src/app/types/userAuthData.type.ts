export type TRegisterUser = {
    name: string;
    email: string;
    password: string;
    role: string;
}

export type TLoginUser = {
    email: string;
    password: string;
}