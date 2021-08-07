import React from "react";
import {JNLEntry} from "./JNLEntry";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"

describe("Entry area tests", () => {
    test("renders expected components", async () => {
        render(<JNLEntry/>)
        const submitButton = await screen.findByTestId("submit-message")
        expect(submitButton.tagName).toBe("svg")

        const entryField = screen.getByTestId("entry-message")
        expect(entryField.tagName).toBe("TEXTAREA")
        expect(entryField).toHaveValue("")
    })

    test("can type into test area", async () => {
        render(<JNLEntry/>)

        const entryField = screen.getByTestId("entry-message")
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        expect(entryField).toHaveValue("Some text!")
    })

    test("submitting text calls addMessage with the current value", async () => {
        const mockAddMessage = jest.fn()
        render(<JNLEntry addMessage={mockAddMessage}/>)

        const entryField = screen.getByTestId("entry-message")
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))

        expect(mockAddMessage.mock.calls.length).toBe(1)
        expect(mockAddMessage.mock.calls[0][0]).toBe("Some text!")
        expect(mockAddMessage.mock.calls[0][1]).toMatch(/^[0-9]+:[0-9]+ [0-9]+\/[0-9]+\/[0-9]+$/)
    })

    test("submitting text resets text in field", async () => {
        const mockAddMessage = jest.fn()
        render(<JNLEntry addMessage={mockAddMessage}/>)

        const entryField = screen.getByTestId("entry-message")
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))
        expect(entryField).toHaveValue("")
    })
})
