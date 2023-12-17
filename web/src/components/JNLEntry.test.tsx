import React from "react";
import {JNLEntry} from "./JNLEntry";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"
import {MessagesContext} from "../contexts/MessagesContext";

describe("Entry area tests", () => {

    const renderPage = (mockAddMessage= jest.fn()) => render(
        <MessagesContext.Provider value={{
            messages: [],
            addMessage: mockAddMessage,
            removeMessage: jest.fn(),
            loading: false,
            clearLocalMessages: jest.fn()
        }}>
            <JNLEntry/>
        </MessagesContext.Provider>)

    test("renders expected components", async () => {
        renderPage()

        const submitButton = await screen.findByTestId("submit-message")
        expect(submitButton.tagName).toBe("svg")

        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        expect(entryField.tagName).toBe("TEXTAREA")
        expect(entryField).toHaveValue("")
    })

    test("can type into test area", async () => {
        renderPage()

        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        expect(entryField).toHaveValue("Some text!")
    })

    test("submitting text calls addMessage with the current value", async () => {
        const mockAddMessage = jest.fn()
        renderPage(mockAddMessage)

        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))

        expect(mockAddMessage.mock.calls.length).toBe(1)
        expect(mockAddMessage.mock.calls[0][0].text).toBe("Some text!")
        expect(mockAddMessage.mock.calls[0][0].date).toMatch(/^[0-9]+:[0-9]+ [0-9]+\/[0-9]+\/[0-9]+$/)
    })

    test("submitting text resets text in field", async () => {
        const mockAddMessage = jest.fn()
        renderPage(mockAddMessage)

        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))
        expect(entryField).toHaveValue("")
    })
})
