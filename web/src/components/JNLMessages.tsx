import React from "react";
import {randomColor} from "randomcolor";

export type JNLMessage = {
    date: string,
    text: string
};

export const messageHash = (message: string): number => {
    // Returns an integer which can be used as a seed for a random color
    return message.split("").map((it) => it.charCodeAt(0)).reduce((acc, curr) => acc + curr)
}

export const getColorForMessage = (message: JNLMessage): string => {
    return randomColor({seed: messageHash(message.text), luminosity: "dark"})
}

type JNLMessageProps = {
    messages: JNLMessage[],
    removeMessage: (number) => void
}

export const JNLMessages = ({messages, removeMessage}: JNLMessageProps): JSX.Element => {
    return (
        <div className={"mt-5"} data-testid={"messages-container"}>
            {messages.slice().reverse().map((it, idx) =>
                <div className={"block p-5 mb-3"} key={idx}>
                    <p className={"blockDate mb-2"}
                       style={{color: getColorForMessage(it)}}>{it.date}</p>
                    <i className={"blockRemove"}
                       onClick={() => removeMessage(messages.length - 1 - idx)}>remove </i>
                    <p className={"blockText mb-0"}>
                        {it.text.split('\n').map((line, idx) => <span key={idx}>{line}<br/></span>)}
                    </p>
                </div>
            )}
        </div>
    )
}
