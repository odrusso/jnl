import React from "react";
import {getColorForMessage, JNLMessages, messageHash} from "./JNLMessages";
import {fireEvent, render, screen, within} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"
import {Message, MessagesContext} from "../contexts/MessagesContext";

describe("Messages test", () => {

    const renderComponent = (messages: Message[] = [], mockRemoveMessage = jest.fn()) => render(
        <MessagesContext.Provider value={{
            messages: messages,
            addMessage: jest.fn(),
            removeMessage: mockRemoveMessage,
            loading: false,
            clearLocalMessages: jest.fn()
        }}>
            <JNLMessages/>
        </MessagesContext.Provider>)

    describe("Utilities test", () => {
        test("message hash returns an integer", () => {
            const result = messageHash("Some text")
            expect(typeof result).toBe("number")
        })

        test("hash returns same result for same messages", () => {
            const result1 = messageHash("Some text")
            const result2 = messageHash("Some text")
            expect(result1).toEqual(result2)
        })

        test("hash returns different result for different messages", () => {
            const result1 = messageHash("Some text")
            const result2 = messageHash("Some other text")
            expect(result1).not.toEqual(result2)
        })

        test("color for message returns hex color", () => {
            const result = getColorForMessage({text: "Some text", date: ""})
            expect(result).toMatch(/^#[a-f0-9]{6}$/)
        })

        test("color for message returns same color for same messages", () => {
            const result1 = getColorForMessage({text: "Some text", date: ""})
            const result2 = getColorForMessage({text: "Some text", date: ""})
            expect(result1).toEqual(result2)
        })

        test("color for message different color for different messages", () => {
            const result1 = getColorForMessage({text: "Some text", date: ""})
            const result2 = getColorForMessage({text: "Some other text", date: ""})
            expect(result1).not.toEqual(result2)
        })
    })

    test("renders correct components with no messages", async () => {
        renderComponent()

        const messagesContainer = await screen.findByTestId("messages-container")
        expect(messagesContainer).toBeInTheDocument()
        expect(messagesContainer.children.length).toBe(0)
    })

    test("renders single message when passed in", async () => {
        const messages = [{text: "Hello world!", date: "00:00 12/34/5678"}]
        renderComponent(messages)

        expect(await screen.findByText("Hello world!")).toBeInTheDocument()
        expect(await screen.findByText("00:00 12/34/5678")).toBeInTheDocument()
    })

    test("renders multiple message when passed in", async () => {
        const messages = [
            {text: "Hello world!", date: "00:00 12/34/5678"},
            {text: "Hello world again!", date: "00:01 12/34/5678"}
        ]
        renderComponent(messages)

        expect(await screen.findByText("Hello world!")).toBeInTheDocument()
        expect(await screen.findByText("00:00 12/34/5678")).toBeInTheDocument()

        expect(await screen.findByText("Hello world again!")).toBeInTheDocument()
        expect(await screen.findByText("00:01 12/34/5678")).toBeInTheDocument()
    })

    test("shows remove button on each message", async () => {
        const messages = [
            {text: "Hello world!", date: "00:00 12/34/5678"},
            {text: "Hello world again!", date: "00:01 12/34/5678"}
        ]
        renderComponent(messages)

        const messageContainer = await screen.findByTestId("messages-container")
        expect(within(messageContainer.children[0] as HTMLElement).getByText("remove")).toBeInTheDocument()
        expect(within(messageContainer.children[1] as HTMLElement).getByText("remove")).toBeInTheDocument()
    })

    test("creates new lines on newline chars", async () => {
        const messages = [
            {text: "1st line\n2nd line", date: "00:00 12/34/5678"},
        ]
        renderComponent(messages)

        // These will only work if the text is broken up into different elements
        expect(await screen.findByText("1st line")).toBeInTheDocument()
        expect(await screen.findByText("1st line")).toBeInTheDocument()
        expect(screen.getByText("1st line").parentElement?.innerHTML).toContain("<br>")
    })

    test("clicking remove calls the removeElement method for single message", async () => {
        const mockRemoveMessage = jest.fn()
        const messages = [{text: "Hello world!", date: "00:00 12/34/5678"}]
        renderComponent(messages, mockRemoveMessage)

        fireEvent.click(await screen.findByText("remove"))

        expect(mockRemoveMessage.mock.calls.length).toBe(1)
        expect(mockRemoveMessage.mock.calls[0][0]).toBe(messages[0])
    })

    test("clicking remove calls the removeElement method with correct index for multiple message", async () => {
        const mockRemoveMessage = jest.fn()
        const messages = [
            {text: "Hello world!", date: "00:00 12/34/5678"},
            {text: "Hello world again!", date: "00:01 12/34/5678"}
        ]
        renderComponent(messages, mockRemoveMessage)

        // The 'top' remove button should remove the most recent message, i.e. the message
        // with the /highest/ index
        fireEvent.click((await screen.findAllByText("remove"))[0])
        expect(mockRemoveMessage.mock.calls[0][0]).toBe(messages[1])
    })
})
