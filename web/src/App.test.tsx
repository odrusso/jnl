import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect"
import {axe} from 'jest-axe';
import {App} from "./App";
import {HashRouter} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {AuthProvider} from "./contexts/AuthContext";
import {MessagesProvider} from "./contexts/MessagesContext";

// eslint-disable-next-line no-undef
beforeEach(() => {
    localStorage.clear()
})

describe("Application tests", () => {
    test("is accessible", async () => {
        const { container } = renderApp()
        expect(await axe(container)).toHaveNoViolations()
    })

    test("can write a message", async () => {
        renderApp()
        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))

        expect(entryField).toHaveTextContent("")
        expect(await screen.findByText("Some text!")).toBeInTheDocument()
    })

    test("loads messages out of local storage", async () => {
        localStorage.setItem("messages", JSON.stringify([{text: "Some text!", date: "Some date!"}]))

        renderApp()

        expect(await screen.findByText("Some text!")).toBeInTheDocument()
        expect(await screen.findByText("Some date!")).toBeInTheDocument()
    })

    test("stores messages into of local storage", async () => {
        renderApp()
        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))

        expect(entryField).toHaveTextContent("")
        expect(await screen.findByText("Some text!")).toBeInTheDocument()

        const entry = JSON.parse(localStorage.getItem("messages")!)
        expect(entry[0].text).toEqual("Some text!")
    })

    test("can remove a message", async () => {
        renderApp()
        const entryField: HTMLTextAreaElement = screen.getByTestId("entry-message").querySelector("textarea")!;
        fireEvent.change(entryField, {target: {value: "Some text!"}})
        fireEvent.click(screen.getByTestId("submit-message"))

        expect(screen.queryByText("Some text!")).toBeInTheDocument()
        fireEvent.click(await screen.findByText("remove"))
        expect(screen.queryByText("Some text!")).not.toBeInTheDocument()
    })
})

const renderApp = () => {
    return render(
        <CookiesProvider>
            <AuthProvider>
                <MessagesProvider>
                    <HashRouter>
                        <App/>
                    </HashRouter>
                </MessagesProvider>
            </AuthProvider>
        </CookiesProvider>
    )
}