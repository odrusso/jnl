import React, {createContext} from "react";
import { useCookies } from "react-cookie";
import {CookieSetOptions} from "universal-cookie/cjs/types";

export type AuthContextType = {
    username: string | null;
    logout: () => void;
    refresh: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.ReactNode> = ({children}) => {
    const [cookies, setCookies, removeCookies] = useCookies(['user', 'cookie-refresh']);
    const apiBaseUrl = process.env.API_URL!;

    const refreshCookies = async () => {
        setCookies("cookie-refresh", `${Math.random()}`)
        removeCookies("cookie-refresh")
    }

    const clearUserCookie = () => {
        const cookieDomain = apiBaseUrl
            .replace("https://api.", "")
            .replace("http://api.", "")
            .replace("/", "")

        const cookieOptions: CookieSetOptions = {
            path: "/",
            domain: `.${cookieDomain}`,
            sameSite: "none",
            secure: true,
            httpOnly: false
        }

        removeCookies('user', cookieOptions);
    }

    return <AuthContext.Provider value={{username: cookies['user'], logout: clearUserCookie, refresh: refreshCookies}}>{children}</AuthContext.Provider>
}
