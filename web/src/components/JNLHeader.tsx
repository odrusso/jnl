import React, {useEffect, useState} from "react";
import {JNLFetch} from "./JNLFetch";
import {JNLMessage} from "./JNLMessages";

type JNLHeaderProps = {
    messages: JNLMessage[],
    updateLocalStorage: (messages: JNLMessage[]) => void
}

export const JNLHeader = ({messages, updateLocalStorage}: JNLHeaderProps): JSX.Element => {
    const [fetchOpen, setFetchOpen] = useState(false)
    const [fetchType, setFetchType] = useState<"POST" | "PUT">("POST")

    // Only run on initial render of this component
    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                setFetchOpen(false)
            }
        })
    }, [])

    return (
        <div className="header
                        mt-3
                        d-flex justify-content-center justify-content-md-end">

            <JNLFetch
                fetchOpen={fetchOpen}
                setFetchOpen={setFetchOpen}
                fetchType={fetchType}
                messages={messages}
                updateLocalStorage={updateLocalStorage}
            />

            <a href={"#"}
               onClick={() => {
                   setFetchOpen(true);
                   setFetchType("POST")
               }}>
                fetch
            </a>

            <a>|</a>

            <a href={"#"}
               onClick={() => {
                   setFetchOpen(true);
                   setFetchType("PUT")
               }}>
                put
            </a>
        </div>
    );
}
