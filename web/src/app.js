import React, {useState} from 'react'
import _ from 'lodash'
import {Col, Container, Row} from "react-bootstrap";
import {JNLEntry} from "./components/JNLEntry.jsx";
import {JNLMessages} from "./components/JNLMessages";
import {JNLHeader} from "./components/JNLHeader";

const possibleGreetings = ["Hope you're okay.", "You've got this!", "How's it hanging?", "Cool green moss.", "Hiiii :)", "You're swell."]
const greeting = _.sample(possibleGreetings)

const storageState = localStorage.getItem('messages')
let initialMessages = [];
if (storageState !== null) {
    initialMessages = JSON.parse(storageState)
} else {
    localStorage.setItem('messages', JSON.stringify([]))
}

export const App = () => {
    const [messages, setMessages] = useState(initialMessages)

    const updateLocalStorage = (newMessages) => {
        setMessages(newMessages)
        localStorage.setItem('messages', JSON.stringify(newMessages))
    }

    const addMessage = (msg, timeString) => {
        let newMessages = messages.concat([{text: msg, date: timeString}])
        updateLocalStorage(newMessages)
    }

    const removeMessage = (idx) => {
        let newMessages = messages
        newMessages.splice(idx, 1)
        updateLocalStorage(newMessages)
    }
    return (
        <>
            <JNLHeader messages={messages} updateLocalStorage={updateLocalStorage}/>
            <Container
                className={
                    "app " +
                    "mt-md-3 pt-md-5 " +
                    "mt-2 pt-2"
                }
                key="jnl-app-container"
            >
                <Row>
                    <Col sm={0} md={1}/>

                    <Col sm={12} md={10}>

                        <h3 className={"mb-5 mt-3 ml-3 ml-md-0"}>{greeting}</h3>

                        <JNLEntry addMessage={addMessage}/>

                        <JNLMessages messages={messages} removeMessage={removeMessage}/>
                    </Col>

                    <Col sm={0} md={1}/>
                </Row>
            </Container>
        </>
    )
}
