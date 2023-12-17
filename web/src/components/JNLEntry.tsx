import React, {useContext, useRef} from "react";
import {TextField} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Message, MessagesContext} from "../contexts/MessagesContext";

export const JNLEntry = (): JSX.Element => {
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const messagesContext = useContext(MessagesContext);

    const twosf = (n: number) => {
        return String(n).padStart(2, '0')
    }

    const handleSubmit = async (e) => {
        const message = messageRef.current?.value;
        if (message) {
            const now = new Date()
            const timeString = `${twosf(now.getHours())}:${twosf(now.getMinutes())} ${twosf(now.getDate())}/${twosf(now.getMonth() + 1)}/${now.getFullYear()}`
            const newMessage: Message = {text: message, date: timeString}
            messagesContext!.addMessage(newMessage)
        }
        messageRef.current!.value = '';
        e.preventDefault()
    }

    return (
        <div className={'form-area'}>
            <form onSubmit={handleSubmit}>
                <TextField
                    placeholder={"Go for it!"}
                    variant={'filled'}
                    inputRef={messageRef}
                    multiline
                    rows={8}
                    data-testid={"entry-message"}
                    aria-label={"message entry"}
                    fullWidth />

                <br/>
                <br/>

                <div style={{textAlign: "center"}}>
                    <AddCircleIcon
                        fontSize={"large"}
                        color={"primary"}
                        data-testid={"submit-message"}
                        onClick={handleSubmit} />
                </div>
            </form>
        </div>
    )
}
