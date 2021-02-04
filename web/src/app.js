import React, {useState} from 'react'
import {randomColor} from 'randomcolor'
import _ from 'lodash'

const possibleGreetings = ["Hope you're okay.", "You've got this!", "How's it hanging?", "Cool green moss.", "Hiiii :)", "You're swell."]
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

    const updateLocalStorage = (newMessages) => {
        setMessages(newMessages)
        localStorage.setItem('messages', JSON.stringify(newMessages))
        setColors(colors.concat([randomColor({luminosity: "dark"})]))
    }

    const handleSubmit = (e) => {
        // Appends message to messages
        if (message !== '') {
            let now = new Date()
            let timeString = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
            let newMessages = messages.concat([{text: message, date: timeString}])
            updateLocalStorage(newMessages)
        }
        setMessage('')
        e.preventDefault()
    }

    const removeThisEntry = (idx) => {
        let newMessages = messages
        newMessages.splice(idx, 1)
        updateLocalStorage(newMessages)
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
                                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z"/>
                            </svg>
                        </div>
                    </form>
                </div>

                <div>
                    {messages.slice().reverse().map((it, idx) =>
                        <div className={"block"} key={idx}>
                            <p className={"blockDate"} style={{color: colors[idx]}}>{it.date}</p>
                            <i className={"blockRemove"}
                               onClick={() => removeThisEntry(messages.length - 1 - idx)}>remove </i>
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