import React, {useContext} from "react";
import {randomColor} from "randomcolor";
import {Message, MessagesContext} from "../contexts/MessagesContext";

export const messageHash = (message: string): number => {
    // Returns an integer which can be used as a seed for a random color
    return message.split("").map((it) => it.charCodeAt(0)).reduce((acc, curr) => acc + curr)
}

export const getColorForMessage = (message: Message): string => {
    return randomColor({seed: messageHash(message.text), luminosity: "dark"})
}

export const JNLMessages = (): JSX.Element => {
    const messagesContext = useContext(MessagesContext)

    return (
        <div className={"mt-5"} data-testid={"messages-container"}>
            {(messagesContext?.messages ?? []).slice().reverse().map((message, index) =>
                <div className={"block p-5 mb-3"} key={index}>
                    <p className={"blockDate mb-2"}
                       style={{color: getColorForMessage(message)}}>{message.date}</p>
                    <i className={"blockRemove"}
                       onClick={() => messagesContext!.removeMessage(message)}>remove </i>
                    <p className={"blockText mb-0"}>
                        {message.text.split('\n').map((line, idx) => <span key={idx}>{line}<br/></span>)}
                    </p>
                </div>
            )}
        </div>
    )
}
