import {isPresent} from "./utils";
import axios from "axios";
import {authUrl} from "../routes/Hrefs";
import {IAuthResponseBody} from "../../server/controllers/AuthController";


export const isAuthenticated = (): boolean => {
    return isPresent(getAuthenticatedUsername()) && isPresent(getAuthenticatedPassword());
};

export const authenticate = async (username: string, password: string): Promise<IAuthResponseBody> => {
    const response = await axios.get(authUrl, {
        auth: {
            username: username,
            password: password,
        }
    });
    setAuthenticatedUsername(username);
    setAuthenticatedPassword(password);
    return await response.data;
}


const usernameKey = "username";
const passwordKey = "password";

const getAuthenticatedUsername = (): string|null => {
    return window.localStorage.getItem(usernameKey);
}

const setAuthenticatedUsername = (v: string): void => {
    window.localStorage.setItem(usernameKey, v);
}

const getAuthenticatedPassword = (): string|null => {
    return window.localStorage.getItem(passwordKey);
}
const setAuthenticatedPassword = (v: string): void => {
    window.localStorage.setItem(passwordKey, v);
}

export const logout = (): void => {
    window.localStorage.removeItem(usernameKey);
    window.localStorage.removeItem(passwordKey);
}