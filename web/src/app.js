import React, {useState} from 'react'
import _ from 'lodash'

const possibleGreetings = ["Hope you're okay.", "I miss you.", "How's it hanging?"]
const greeting = _.sample(possibleGreetings)

export function App(props) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const handleType = (e) => {
        // target.value should be the value of the input
        setMessage(e.target.value)
    }
    const handleSubmit = (e) => {
        // Appends message to messages
        setMessages(messages.concat([message]))
        e.preventDefault()
    }

    return (
        <>
            <div className={"app"}>
                <h3>{greeting}</h3>

                <div>
                    <form onSubmit={handleSubmit}>
                        <input className="form-text" type="text" value={message} onChange={handleType}/>
                        <input type="submit"/>
                    </form>
                </div>

                <div>
                    {message}
                    <br/>
                    {messages.join(" | ")}
                </div>
            </div>
        </>
    )
}