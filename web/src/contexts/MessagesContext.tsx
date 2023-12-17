import React, {createContext, useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext";
import _ from "lodash";

export type Message = {
    date: string,
    text: string
};

export type MessageContextProps = {
    messages: Message[] | null
    addMessage: (message: Message) => Promise<void>
    removeMessage: (message: Message) => Promise<void>
    clearLocalMessages: () => void;
    loading: boolean
}

const parseMessageDate = (dateString: string): Date => {
    const time = dateString.split(" ")[0]
    const date = dateString.split(" ")[1]
    const minutes = +time.split(":")[0]
    const hours = +time.split(":")[1]
    const days = +date.split("/")[0]
    const month = +date.split("/")[1] + 1  // Because we add 1 to be human months when creating
    const year = +date.split("/")[2]

    return new Date(year, month, days, hours, minutes)
}

export const mergeMessages = (local: Message[], remote: Message[]): Message[] => {
    let messages = [...local, ...remote]
    messages = _.uniqWith(messages, _.isEqual)
    messages.sort((a: Message, b: Message) => +parseMessageDate(a.date) - +parseMessageDate(b.date))
    return messages
}

export const MessagesContext = createContext<MessageContextProps | null>(null);

export const MessagesProvider: React.FC<React.ReactNode> = ({children}) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const apiBaseUrl = process.env.API_URL!;

    // Run only on initial render of the app
    useEffect(() => {
        // Do some fetching and merging here...
        setMessages(getLocalstorageMessages())
    }, [])

    useEffect(() => {
        // Don't run if uninitialized or logged out
        if (authContext?.username) addMessage();
    }, [authContext?.username])

    const fetchMessages = async (): Promise<Message[]> => {
        // For debugging
        const fetchResponse = await fetch(
            apiBaseUrl + 'messages',
            {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        console.log(fetchResponse)
        if (fetchResponse.status != 200) return []

        try {
            const body = await fetchResponse.text();
            if (!body) return []
            const messages = JSON.parse(body);
            if (!messages) return []
            return messages
        } catch (e) {
            console.error(e)
            return []
        }
    }

    const postMessages = async (messages: Message[]) => {
        // For debugging
        const fetchResponse = await fetch(
            apiBaseUrl + 'messages',
            {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messages)
            })
        console.log(fetchResponse)

        if (fetchResponse.status != 200) {
            alert("failed to sync messages")
            console.error(fetchResponse)
        }
    }

    const setLocalstorageMessages = (messages: Message[]) => {
        localStorage.setItem('messages', JSON.stringify(messages))
    }

    const getLocalstorageMessages = (): Message[] => {
        const localMessages = localStorage.getItem('messages')
        if (!localMessages) return []
        return JSON.parse(localMessages)
    }

    const addMessage = async (message?: Message) => {
        setLoading(true)
        console.log('adding message', message?.text)
        const newLocalMessages = message ? [...messages, message] : [...messages]
        console.log('local messages inc new', newLocalMessages)

        const remoteMessages = authContext?.username ? await fetchMessages() : []
        console.log('remote messages', remoteMessages)

        const newMessages = mergeMessages(remoteMessages, newLocalMessages);
        console.log('merged messages', newMessages)

        setMessages(newMessages)
        setLocalstorageMessages(newMessages)

        if (authContext?.username) await postMessages(newMessages)
        setLoading(false)
    }

    const removeMessage = async (message: Message) => {
        const remoteMessages = authContext?.username ? await fetchMessages() : []

        const mergedMessages = mergeMessages(remoteMessages, messages);

        const newMessages = mergedMessages.filter((a: Message) => !_.isEqual(a, message))

        setMessages(newMessages)
        setLocalstorageMessages(newMessages)

        if (authContext?.username) await postMessages(newMessages)
    }

    const clearLocalMessages = async () => {
        setMessages([])
        setLocalstorageMessages([])
    }

    return <MessagesContext.Provider value={{messages, addMessage, removeMessage, loading, clearLocalMessages}} >{children}</MessagesContext.Provider>
}
