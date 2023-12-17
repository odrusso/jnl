import React, {useContext, useState} from "react";
import {Button, CircularProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
import {MessagesContext} from "../contexts/MessagesContext";

export const JNLHeader = (): JSX.Element => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [loginDisabled, setLoginDisabled] = useState(false);
    const logoutApiUrl = process.env.API_URL! + "logout";
    const messagesContext = useContext(MessagesContext)

    const logout = async () => {
        setLoginDisabled(true)
        try {
            await fetch(
                logoutApiUrl,
                {
                    method: 'post',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                }
            )
        } catch (e) {
            console.error(e)
        }
        authContext!.logout();
        messagesContext!.clearLocalMessages();
        setLoginDisabled(false)
    }

    return (
        <div className="header mt-3 d-flex justify-content-center justify-content-md-end">
            {messagesContext?.loading && (<CircularProgress />)}
            {authContext?.username && (
                <>
                    <Button disabled={loginDisabled} onClick={logout}>logout</Button>
                </>
            )}
            {!authContext?.username && (
                <>
                    <Button onClick={() => navigate("/login")}>login</Button>
                    <Button onClick={() => navigate("/register")}>register</Button>
                </>
            )}
        </div>
    );
}
