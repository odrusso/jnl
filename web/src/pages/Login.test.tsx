import React from "react";
import {Login} from "./Login";
import {render, screen} from "@testing-library/react";
import {HashRouter} from "react-router-dom";

describe("Login page tests", () => {
    test("can login", async () => {
        render(<HashRouter><Login/></HashRouter>)
        expect(await screen.findByText("Login")).toBeInTheDocument()
    })
})
