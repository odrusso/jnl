import React from "react";
import {render, screen} from "@testing-library/react";
import {Register} from "./Register";
import {HashRouter} from "react-router-dom";

describe("Register page tests", () => {
    test("can register", async () => {
        render(<HashRouter><Register/></HashRouter>)
        expect(await screen.findAllByText("Register"))
    })
})
