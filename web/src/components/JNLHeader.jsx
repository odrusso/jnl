import React, {useEffect, useState} from "react";
import {JNLFetch} from "./JNLFetch";

export const JNLHeader = ({messages, updateLocalStorage}) => {
    const [fetchOpen, setFetchOpen] = useState(false)
    const [fetchType, setFetchType] = useState("POST") // POST or PUT

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
