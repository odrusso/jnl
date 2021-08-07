import React from 'react'
import {App} from "./app";

export const Home = () => {
    return (
        <>
            <App/>
            <a
                href="https://github.com/odrusso/jnl"
                target="__blank"
                className={"contribute d-none d-xl-block p-2"}
            >contribute</a>
        </>
    )
}