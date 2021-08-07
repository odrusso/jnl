import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";

const fetchApi = 'https://api.jnlapp.io/messages'

export const JNLFetch = ({fetchOpen, setFetchOpen, fetchType, messages, updateLocalStorage}) => {
    const [fetchName, setFetchName] = useState('')
    const [fetchPassword, setFetchPassword] = useState('')
    const [fetchError, setFetchError] = useState('')
    const [fetchButtonEnabled, setFetchButtonEnabled] = useState(true)

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
                switch(res.status) {
                    case 201:
                        res.json().then(() => {
                            setFetchButtonEnabled(true)
                            setFetchPassword('')
                            setFetchOpen(false)
                        })
                        break;
                    case 500:
                        setFetchError('Server error')
                        break;
                    case 403:
                        setFetchError('Invalid credentials')
                        break;
                    case 400:
                        setFetchError('Bad request error')
                        break;
                    default:
                        setFetchError(`Unknown error ${res.status}`)
                }
                setFetchButtonEnabled(true)
            })
            .catch(e => {
                console.error(e)
                setFetchError("Unknown error")
                setFetchButtonEnabled(true)
            })
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
                switch(res.status) {
                    case 200:
                        res.json().then(data => {
                            updateLocalStorage(data)
                            setFetchButtonEnabled(true)
                            setFetchPassword('')
                            setFetchOpen(false)
                        })
                        break;
                    case 500:
                        setFetchError('Server error')
                        break;
                    case 403:
                        setFetchError('Invalid credentials')
                        break;
                    case 400:
                        setFetchError('Bad request error')
                        break;
                    default:
                        setFetchError(`Unknown error ${res.status}`)
                }
                setFetchButtonEnabled(true)
            })
            .catch(e => {
                console.error(e)
                setFetchError("Unknown error")
                setFetchButtonEnabled(true)
            })
    }

    const displayMode = fetchType === 'POST' ? 'Fetch' : 'Put'
    const executeMode = fetchType === 'POST' ? handleFetch : handlePut
    return (
        <Modal
            show={fetchOpen}
            data-testid={"modal"}
            centered
        >
            <form onSubmit={() => {}}>
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
                        onChange={(e) => setFetchName(e.target.value)}
                    />
                    <input
                        disabled={!fetchButtonEnabled}
                        className="fetch-input pl-3 py-2"
                        key="jnl-fetch-password"
                        placeholder={"Pigeonhole password"}
                        value={fetchPassword}
                        onChange={(e) => setFetchPassword(e.target.value)}
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
