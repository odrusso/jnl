import React from "react";

export function Header(props) {
    return (
        <>
            <div className="header">
                <a href={"/info"}>info</a>
                <a>|</a>
                <a href={"/login"}>log in</a>
            </div>
        </>
    );
}