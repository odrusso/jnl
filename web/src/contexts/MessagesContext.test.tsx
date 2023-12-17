import {mergeMessages, Message} from "./MessagesContext";

describe("messages context tests", () => {
    describe("merging unit tests", () => {
        it("no diff", () => {
            const local: Message[] = []
            const remote: Message[] = []
            const expected: Message[] = []

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("local ahead remote empty", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const remote: Message[] = []

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("local ahead remote not empty", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"}
            ]

            const remote: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("local ahead 2 remote not empty", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"},
                {date: "00:00 02/01/2000", text: "message c"},
            ]

            const remote: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"},
                {date: "00:00 02/01/2000", text: "message c"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("local empty remote ahead", () => {
            const local: Message[] = []

            const remote: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("local non empty remote ahead", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"}
            ]

            const remote: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message b"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("full diff with simple order", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message c"}
            ]

            const remote: Message[] = [
                {date: "00:00 03/01/2000", text: "message d"},
                {date: "00:00 04/01/2000", text: "message e"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message c"},
                {date: "00:00 03/01/2000", text: "message d"},
                {date: "00:00 04/01/2000", text: "message e"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })

        it("full diff with more complex order", () => {
            const local: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 04/01/2000", text: "message e"}
            ]

            const remote: Message[] = [
                {date: "00:00 03/01/2000", text: "message d"},
                {date: "00:00 02/01/2000", text: "message c"}
            ]

            const expected: Message[] = [
                {date: "00:00 01/01/2000", text: "message a"},
                {date: "00:00 02/01/2000", text: "message c"},
                {date: "00:00 03/01/2000", text: "message d"},
                {date: "00:00 04/01/2000", text: "message e"}
            ]

            const merged = mergeMessages(local, remote)
            expect(merged).toEqual(expected)
        })
    })
})
