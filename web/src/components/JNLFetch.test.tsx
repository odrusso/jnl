import React from "react";
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"
import {JNLFetch} from "./JNLFetch";
import {server} from "../mocks/server";
import {rest} from "msw";

describe("Fetch tests", () => {
    test("clicking close exits the modal", async () => {
        const mockSetFetchOpen = jest.fn()
        render(<JNLFetch fetchOpen={true}
                         setFetchOpen={mockSetFetchOpen}
                         fetchType={"POST"}
                         messages={[]}
                         updateLocalStorage={jest.fn()}
        />)
        expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
        fireEvent.click(await screen.findByText("Close"))
        expect(mockSetFetchOpen.mock.calls.length).toEqual(1)
        expect(mockSetFetchOpen.mock.calls[0][0]).toEqual(false)
    })

    test.skip("escape key exits the modal", async () => {
        // Can't get this working, thinking that JSDom doesn't care about
        // the document.bind
        const mockSetFetchOpen = jest.fn()
        render(<JNLFetch fetchOpen={true}
                         fetchType={"POST"}
                         setFetchOpen={mockSetFetchOpen}
                         messages={[]}
                         updateLocalStorage={jest.fn()}
        />)
        expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
        fireEvent.keyDown(await screen.findByTestId("modal"), {key: "Escape", code: "Escape"})
        expect(mockSetFetchOpen.mock.calls.length).toEqual(1)
        expect(mockSetFetchOpen.mock.calls[0][0]).toEqual(false)
    })

    test("fetch button shows as disabled while fetching", async () => {
        mockApiPost(200, [{text: "Hello test world!", date: "Blah"}], 50)
        render(<JNLFetch fetchOpen={true}
                         fetchType={"POST"}
                         updateLocalStorage={jest.fn()}
                         setFetchOpen={jest.fn()}
                         messages={[]}
        />)
        expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
        const modalContainer = await screen.findByTestId("modal")
        fireEvent.click(await within(modalContainer).findByText("Fetch"))
        expect(await within(modalContainer).findByText("Fetch")).toBeDisabled()
        await waitFor(async () => {
            expect(await within(modalContainer).findByText("Fetch")).not.toBeDisabled()
        })
    })

    describe("POST", () => {
        test("renders expected components for POST", async () => {
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            expect(screen.getByText("Close")).toBeInTheDocument()
            const modalContainer = screen.getByTestId("modal")
            expect(within(modalContainer).getByPlaceholderText("Pigeonhole name")).toBeInTheDocument()
            expect(within(modalContainer).getByPlaceholderText("Pigeonhole password")).toBeInTheDocument()
            expect(within(modalContainer).getByText("Fetch")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 500", async () => {
            mockApiPost(500, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            expect(await screen.findByText("Server error")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 403", async () => {
            mockApiPost(403, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 400", async () => {
            mockApiPost(400, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            expect(await screen.findByText("Bad request error")).toBeInTheDocument()
        })

        test("shows an error when the fetch throws an exception", async () => {
            server.use(
                rest.post('https://api.jnlapp.io/messages', async () => {
                    throw "some error"
                }),
            )
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            expect(await screen.findByText("Unknown error")).toBeInTheDocument()
        })

        test("shows an error when the API returns an unknown error", async () => {
            mockApiPost(543, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            expect(await screen.findByText("Unknown error 543")).toBeInTheDocument()
        })

        test("puts correct data", async () => {
            const messages = [{text: "Some text!", date: "blah blah blah"}]
            let requestBody;
            server.use(
                rest.put('https://api.jnlapp.io/messages', async (req, res, ctx) => {
                    // eslint-disable-next-line no-undef
                    requestBody = req.body
                    return res(
                        ctx.status(201),
                        ctx.json([])
                    )
                }),
            )
            const mockUpdateLocalStorage = jest.fn()
            const mockSetFetchOpen = jest.fn()
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={mockUpdateLocalStorage}
                             setFetchOpen={mockSetFetchOpen}
                             messages={messages}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.change(screen.getByPlaceholderText("Pigeonhole name"), {target: {value: "some name"}})
            fireEvent.change(screen.getByPlaceholderText("Pigeonhole password"), {target: {value: "some pass"}})
            fireEvent.click(await within(modalContainer).findByText("Put"))
            await waitFor(async () => {
                expect(await within(modalContainer).findByText("Put")).not.toBeDisabled()
            })
            console.log(requestBody)
            expect(requestBody.messages).toEqual(JSON.stringify(messages))
            expect(requestBody.pigeonHoleName).toEqual("some name")
            expect(requestBody.pigeonHolePass).toEqual("some pass")
        })

        test("calls update local storage when the API returns a 200", async () => {
            mockApiPost(200, [{text: "Hello test world!", date: "Blah"}])
            const mockUpdateLocalStorage = jest.fn()
            const mockSetFetchOpen = jest.fn()
            render(<JNLFetch fetchOpen={true}
                             fetchType={"POST"}
                             updateLocalStorage={mockUpdateLocalStorage}
                             setFetchOpen={mockSetFetchOpen}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Fetch")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Fetch"))
            await waitFor(async () => {
                expect(await within(modalContainer).findByText("Fetch")).not.toBeDisabled()
            })
            expect(mockUpdateLocalStorage.mock.calls.length).toEqual(1)
            expect(mockUpdateLocalStorage.mock.calls[0][0][0].text).toEqual("Hello test world!")
            expect(mockSetFetchOpen.mock.calls.length).toEqual(1)
            expect(mockSetFetchOpen.mock.calls[0][0]).toEqual(false)
        })
    })

    describe("PUT", () => {
        test("renders expected components for PUT", async () => {
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = screen.getByTestId("modal")
            expect(within(modalContainer).getByText("Put")).toBeInTheDocument()
            expect(within(modalContainer).getByPlaceholderText("Pigeonhole name")).toBeInTheDocument()
            expect(within(modalContainer).getByPlaceholderText("Pigeonhole password")).toBeInTheDocument()
            expect(within(modalContainer).getByText("Put")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 500", async () => {
            mockApiPut(500, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            expect(await screen.findByText("Server error")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 403", async () => {
            mockApiPut(403, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
        })

        test("shows an error when the API returns a 400", async () => {
            mockApiPut(400, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            expect(await screen.findByText("Bad request error")).toBeInTheDocument()
        })

        test("shows an error when the fetch throws an exception", async () => {
            server.use(
                rest.put('https://api.jnlapp.io/messages', async () => {
                    throw "some error"
                }),
            )
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            expect(await screen.findByText("Unknown error")).toBeInTheDocument()
        })

        test("shows an error when the API returns an unknown error", async () => {
            mockApiPut(543, [])
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={jest.fn()}
                             setFetchOpen={jest.fn()}
                             messages={[]}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            expect(await screen.findByText("Unknown error 543")).toBeInTheDocument()
        })

        test("posts correct data", async () => {
            const messages = [{text: "Some text!", date: "blah blah blah"}]
            let requestBody;
            server.use(
                rest.put('https://api.jnlapp.io/messages', async (req, res, ctx) => {
                    // eslint-disable-next-line no-undef
                    requestBody = req.body
                    return res(
                        ctx.status(201),
                        ctx.json([])
                    )
                }),
            )
            const mockUpdateLocalStorage = jest.fn()
            const mockSetFetchOpen = jest.fn()
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={mockUpdateLocalStorage}
                             setFetchOpen={mockSetFetchOpen}
                             messages={messages}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.change(screen.getByPlaceholderText("Pigeonhole name"), {target: {value: "some name"}})
            fireEvent.change(screen.getByPlaceholderText("Pigeonhole password"), {target: {value: "some pass"}})
            fireEvent.click(await within(modalContainer).findByText("Put"))
            await waitFor(async () => {
                expect(await within(modalContainer).findByText("Put")).not.toBeDisabled()
            })
            console.log(requestBody)
            expect(requestBody.messages).toEqual(JSON.stringify(messages))
            expect(requestBody.pigeonHoleName).toEqual("some name")
            expect(requestBody.pigeonHolePass).toEqual("some pass")
        })

        test("closes modal on 201", async () => {
            const messages = [{text: "Some text!", date: "blah blah blah"}]
            mockApiPut(201, [])
            const mockUpdateLocalStorage = jest.fn()
            const mockSetFetchOpen = jest.fn()
            render(<JNLFetch fetchOpen={true}
                             fetchType={"PUT"}
                             updateLocalStorage={mockUpdateLocalStorage}
                             setFetchOpen={mockSetFetchOpen}
                             messages={messages}
            />)
            expect(await screen.findByText("Pigeonhole Put")).toBeInTheDocument()
            const modalContainer = await screen.findByTestId("modal")
            fireEvent.click(await within(modalContainer).findByText("Put"))
            await waitFor(async () => {
                expect(await within(modalContainer).findByText("Put")).not.toBeDisabled()
            })
            expect(mockSetFetchOpen.mock.calls.length).toEqual(1)
            expect(mockSetFetchOpen.mock.calls[0][0]).toEqual(false)
        })
    })
})

const mockApiPost = (code, messages, delay = 0) => {
    server.use(
        rest.post('https://api.jnlapp.io/messages', async (req, res, ctx) => {
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, delay))
            return res(
                ctx.status(code),
                ctx.json(messages)
            )
        }),
    )
}

const mockApiPut = (code, messages, delay = 0) => {
    server.use(
        rest.put('https://api.jnlapp.io/messages', async (req, res, ctx) => {
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, delay))
            return res(
                ctx.status(code),
                ctx.json(messages)
            )
        }),
    )
}
