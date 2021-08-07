import React, {useState} from "react";
import {CheckCircleFill} from "react-bootstrap-icons";

export const JNLEntry = ({addMessage}) => {

    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        // Appends message to messages
        if (message !== '') {
            let now = new Date()
            let timeString = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
            addMessage(message, timeString)
        }
        setMessage('')
        e.preventDefault()
    }

    return (
        <div className={'form-area'}>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="form-text p-4"
                    key="jnl-text-area"
                    value={message}
                    data-testid={"entry-message"}
                    onChange={(e) => setMessage(e.target.value)}/>
                <br/>
                <br/>

                <div style={{textAlign: "center"}}>
                    <h2>
                        <CheckCircleFill data-testid={"submit-message"} onClick={handleSubmit}/>
                    </h2>
                </div>
            </form>
        </div>
    )
}
