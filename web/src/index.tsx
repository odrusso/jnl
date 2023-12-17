import React from "react";
import {render} from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jnl.css'
import {App} from "./App";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login";
import {StyleContainer} from "./components/StyleContainer";
import {Register} from "./pages/Register";
import {CookiesProvider} from "react-cookie";
import {MessagesProvider} from "./contexts/MessagesContext";

render(
    <>
        <StyleContainer>
            <CookiesProvider>
                <AuthProvider>
                    <MessagesProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path={"/"} element={<App />} />
                                <Route path={"/login"} element={<Login />} />
                                <Route path={"/register"} element={<Register />} />
                            </Routes>
                        </BrowserRouter>
                    </MessagesProvider>
                </AuthProvider>
            </CookiesProvider>
        </StyleContainer>
    </>,
    document.getElementById("root")
)
