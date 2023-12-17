import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"
import {JNLHeader} from "./JNLHeader";
import {HashRouter} from "react-router-dom";

describe("Header tests", () => {
    test("renders expected components", async () => {
        render(<HashRouter><JNLHeader /></HashRouter>)
        expect(await screen.findByText("login"))
    })
})
