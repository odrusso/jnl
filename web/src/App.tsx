import React, {useEffect, useState} from 'react'
import {Col, Container, Row} from "react-bootstrap";
import {JNLEntry} from "./components/JNLEntry";
import {JNLMessage, JNLMessages} from "./components/JNLMessages";
import {JNLHeader} from "./components/JNLHeader";
import {JNLGreeting} from "./components/JNLGreeting";

export const App = (): JSX.Element => {
    const [messages, setMessages] = useState<JNLMessage[]>([])

    // Run only on initial render of the app
    useEffect(() => {
        // Pull data from LocalStorage, if it exists
        const storageState = localStorage.getItem('messages')
        if (storageState !== null) {
            setMessages(JSON.parse(storageState))
        } else {
            localStorage.setItem('messages', JSON.stringify([]))
        }
    }, [])

    const updateLocalStorage = (newMessages: JNLMessage[]) => {
        setMessages(newMessages)
        localStorage.setItem('messages', JSON.stringify(newMessages))
    }

    const addMessage = (msg: JNLMessage) => {
        const newMessages = JSON.parse(JSON.stringify(messages)) // Deep copy of messages
        newMessages.push(msg)
        updateLocalStorage(newMessages)
    }

    const removeMessage = (idx: number) => {
        const newMessages = messages.slice()
        newMessages.splice(idx, 1)
        updateLocalStorage(newMessages)
    }

    return (
        <>
            <JNLHeader messages={messages} updateLocalStorage={updateLocalStorage}/>
            <Container
                className={"app mt-md-3 pt-md-5 mt-2 pt-2"}>
                <Row>
                    <Col sm={0} md={1}/>

                    <Col sm={12} md={10}>
                        <JNLGreeting/>

                        <JNLEntry addMessage={addMessage}/>

                        <JNLMessages messages={messages} removeMessage={removeMessage}/>
                    </Col>

                    <Col sm={0} md={1}/>
                </Row>
            </Container>
        </>
    )
}
