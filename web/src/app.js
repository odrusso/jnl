import React, {useState} from 'react'
import _ from 'lodash'
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {JNLEntry} from "./components/JNLEntry.jsx";
import {JNLMessages} from "./components/JNLMessages";

const possibleGreetings = ["Hope you're okay.", "You've got this!", "How's it hanging?", "Cool green moss.", "Hiiii :)", "You're swell."]
const greeting = _.sample(possibleGreetings)
const fetchApi = 'https://api.jnlapp.io/messages'

const storageState = localStorage.getItem('messages')
let initialMessages = [];
if (storageState !== null) {
    initialMessages = JSON.parse(storageState)
} else {
    localStorage.setItem('messages', JSON.stringify([]))
}

export function App(props) {
    const [messages, setMessages] = useState(initialMessages)
    const [fetchOpen, setFetchOpen] = useState(false)
    const [fetchType, setFetchType] = useState("POST") // POST or PUT
    const [fetchName, setFetchName] = useState('')
    const [fetchPassword, setFetchPassword] = useState('')
    const [fetchError, setFetchError] = useState('')
    const [fetchButtonEnabled, setFetchButtonEnabled] = useState(true)

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            setFetchOpen(false)
        }
    })

    const handleTypeFetchName = (e) => {
        setFetchName(e.target.value)
    }

    const handleTypeFetchPassword = (e) => {
        setFetchPassword(e.target.value)
    }

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

    const handleFetch = () => {
        setFetchButtonEnabled(false)
        setFetchError('')
        fetch(
            fetchApi,
            {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'pigeonHoleName': fetchName,
                    'pigeonHolePass': fetchPassword
                })
            })
            .then(res => {
                if (res.status !== 200) {
                    setFetchError('Invalid!')
                    setFetchButtonEnabled(true)
                } else {
                    res.json().then(data => {
                        updateLocalStorage(data)
                        setFetchButtonEnabled(true)
                        setFetchPassword('')
                        setFetchOpen(false)
                    })
                }
            })
    }

    const handlePut = () => {
        setFetchButtonEnabled(false)
        setFetchError('')
        fetch(
            fetchApi,
            {
                method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'pigeonHoleName': fetchName,
                    'pigeonHolePass': fetchPassword,
                    'messages': JSON.stringify(messages)
                })
            })
            .then(res => {
                if (res.status !== 201) {
                    setFetchError('Invalid!')
                    setFetchButtonEnabled(true)
                } else {
                    setFetchButtonEnabled(true)
                    setFetchPassword('')
                    setFetchOpen(false)
                }
            })
            .catch(e => {
                console.error(e)
                setFetchError("Server error")
                setFetchButtonEnabled(true)
            })
    }

    const JNLFetch = () => {
        const displayMode = fetchType === 'POST' ? 'Fetch' : 'Put'
        const executeMode = fetchType === 'POST' ? handleFetch : handlePut
        return (
            <Modal show={fetchOpen} centered>
                <form onSubmit={() => {
                }}>
                    <Modal.Header>
                        <Modal.Title>Pigeonhole {displayMode}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input
                            disabled={!fetchButtonEnabled}
                            className="fetch-input pl-3 py-2 mb-3"
                            key="jnl-fetch-name"
                            placeholder={"Pigeonhole name"}
                            value={fetchName}
                            onChange={handleTypeFetchName}
                        />
                        <input
                            disabled={!fetchButtonEnabled}
                            className="fetch-input pl-3 py-2"
                            key="jnl-fetch-password"
                            placeholder={"Pigeonhole password"}
                            value={fetchPassword}
                            onChange={handleTypeFetchPassword}
                            type={"password"}
                        />
                        <p hidden={fetchError === ''} className={"text-danger mt-3"}>{fetchError}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant={"secondary"} onClick={() => {
                            setFetchOpen(false)
                        }}>Close</Button>
                        <Button type={"submit"} variant={"primary"} disabled={!fetchButtonEnabled}
                                onClick={() => executeMode()}>{displayMode}</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        )
    }

    const JNLHeader = () => {
        return (
            <div className="header
                            mt-3
                            d-flex justify-content-center justify-content-md-end">
                <a href={"#"} onClick={() => {
                    setFetchOpen(true);
                    setFetchType("POST")
                }}>fetch</a>
                <a>|</a>
                <a href={"#"} onClick={() => {
                    setFetchOpen(true);
                    setFetchType("PUT")
                }}>put</a>
            </div>
        );
    }

    return (
        <>
            <JNLHeader/>
            <Container
                className={
                    "app " +
                    "mt-md-3 pt-md-5 " +
                    "mt-2 pt-2"
                }
                key="jnl-app-container"
            >
                {JNLFetch(props)}

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
