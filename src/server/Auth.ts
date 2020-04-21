import * as crypto from "crypto";

interface IUser {
    username: string;
    password: string;
}

const users: IUser[] = [
    {
        username: 'jordi',
        // This is the SHA256 hash for value of `password`
        password: '78965412'
    }
];

export const findUser = (username: string): IUser|undefined => {
    return users.find(u => u.username === username);
}

export const isPasswordCorrect = (user: IUser, password: string): boolean => {
    return user.password === password;
}

const authToken: any = {};

export const generateAuthToken = (user: IUser): string => {
    const token = crypto.randomBytes(30).toString('hex');
    authToken[token] = user;

    return token;
}

export const getUserFromToken = (token: string): IUser => {
    return authToken[token];
}