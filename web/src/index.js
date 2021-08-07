import React from "react";
import {render} from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jnl.css'
import {App} from "./App";

render(
    <>
        <App/>
        <a
            href="https://github.com/odrusso/jnl"
            target="__blank"
            className={"contribute d-none d-xl-block p-2"}
        >contribute</a>
    </>,
    document.getElementById("root")
)