import React, {useState} from 'react'
import {randomColor} from 'randomcolor'
import _ from 'lodash'

const possibleGreetings = ["Hope you're okay.", "I miss you.", "How's it hanging?", "Cool green moss.", "Hiiii :)", "You're swell."]
const greeting = _.sample(possibleGreetings)

const storageState = localStorage.getItem('messages')
let initialMessages = [];
if (storageState !== null) {
    initialMessages = JSON.parse(storageState)
} else {
    localStorage.setItem('messages', JSON.stringify([]))
}

export function App(props) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [colors, setColors] = useState(randomColor({seed: 0, luminosity: "dark", count: messages.length}))

    const handleType = (e) => {
        // target.value should be the value of the input
        setMessage(e.target.value)
    }

    const handleSubmit = (e) => {
        // Appends message to messages
        let newMessages = []
        if (message !== '') {
            let now = new Date()
            let timeString = now.getHours() + ":" + now.getMinutes() + " " + now.getDate() + "/" + now.getMonth() + 1 + "/" + now.getFullYear()
            newMessages = messages.concat([{text: message, date: timeString}])
            setMessages(newMessages)
            localStorage.setItem('messages', JSON.stringify(newMessages))
            setColors(colors.concat([randomColor({luminosity: "dark"})]))
        }
        setMessage('')
        e.preventDefault()
    }

    const resetMessages = (e) => {
        setMessages([])
        localStorage.setItem('messages', JSON.stringify([]))
    }

    return (
        <>
            <div className={"app"}>
                <h3>{greeting}</h3>
                <br/>
                <br/>
                <div className={'form-area'}>
                    <form onSubmit={handleSubmit}>
                        <textarea className="form-text" type="text" value={message} onChange={handleType}/>
                        <br/>
                        <br/>
                        <div style={{textAlign: "center"}}>
                            <svg onClick={handleSubmit} xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                 viewBox="0 0 36 36">
                                <path
                                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"/>
                            </svg>
                            <svg onClick={resetMessages} xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                 viewBox="0 0 36 36">
                                <path
                                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/>
                            </svg>
                        </div>
                    </form>
                </div>

                <div>
                    {messages.slice().reverse().map((it, idx) =>
                        <div className={"block"} key={idx}>
                            <p className={"blockDate"} style={{color: colors[idx]}}>{it.date}</p>
                            <p className={"blockText"}>
                                {it.text.split('\n').map((line) =>
                                    <> {line} <br/> </>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}