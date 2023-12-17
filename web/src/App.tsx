import React from 'react'
import {Col, Container, Row} from "react-bootstrap";
import {JNLEntry} from "./components/JNLEntry";
import {JNLMessages} from "./components/JNLMessages";
import {JNLHeader} from "./components/JNLHeader";
import {JNLGreeting} from "./components/JNLGreeting";

export const App = (): JSX.Element => {
    return (
        <>
            <JNLHeader />
            <Container
                className={"app mt-md-3 pt-md-5 mt-2 pt-2"}>
                <Row>
                    <Col sm={0} md={1}/>

                    <Col sm={12} md={10}>
                        <JNLGreeting />
                        <JNLEntry />
                        <JNLMessages />
                    </Col>

                    <Col sm={0} md={1}/>
                </Row>
            </Container>
        </>
    )
}
