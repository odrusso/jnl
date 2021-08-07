import React from 'react'
import {JNLGreeting, possibleGreetings} from "./JNLGreeting";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"


describe("Greeting test", () => {
    test("returns a header from the expected list", async () => {
        render(<JNLGreeting />)
        expect(possibleGreetings).toContain((await screen.findByTestId("greeting")).textContent)
    })
})
