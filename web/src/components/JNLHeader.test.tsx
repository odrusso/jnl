import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"
import {JNLHeader} from "./JNLHeader";

describe("Header tests", () => {
    test("renders expected components", async () => {
        render(<JNLHeader messages={[]} updateLocalStorage={jest.fn()} />)
        expect(await screen.findByText("fetch"))
        expect(screen.getByText("fetch").tagName).toBe("A")
        expect(await screen.findByText("put"))
        expect(screen.getByText("put").tagName).toBe("A")
    })

    test("clicking fetch opens fetch modal", async () => {
        render(<JNLHeader messages={[]} updateLocalStorage={jest.fn()} />)
        fireEvent.click(await screen.findByText("fetch"))
        expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
    })

    test("clicking fetch opens put modal", async () => {
        render(<JNLHeader messages={[]} updateLocalStorage={jest.fn()} />)
        fireEvent.click(await screen.findByText("put"))
        expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
    })
})
