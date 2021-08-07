import React, {useState} from "react";
import _ from "lodash";

export const possibleGreetings = ["Hope you're okay.", "You've got this!", "How's it hanging?", "Cool green moss.", "Hiiii :)", "You're swell."]


export const JNLGreeting = () => {

    const [greeting] = useState(_.sample(possibleGreetings))

    return (<h3 data-testid={"greeting"} className={"mb-5 mt-3 ml-3 ml-md-0"}>{greeting}</h3>)
}
