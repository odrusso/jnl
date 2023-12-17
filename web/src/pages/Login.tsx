import React, {useContext, useRef, useState} from "react";
import {Button, Container, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";

export const Login = (): JSX.Element => {
    const [loginSubmitting, setLoginSubmitting] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const loginApiUrl = process.env.API_URL! + "login";

    const login = async () => {
        setLoginSubmitting(true);

        try {
            const fetchResponse = await fetch(
                loginApiUrl,
                {
                    method: 'post',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameRef.current!.value,
                        password: passwordRef.current!.value
                    })
                })

            switch (fetchResponse.status) {
                case 200:
                    authContext!.refresh();
                    navigate("/");
                    return
            }
        } catch (e) {
            console.error(e)
        }
        setLoginSubmitting(false)
        alert("invalid login attempt apparently")
    }

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <Container maxWidth={"sm"} className={"login-container p-5"}>
                <Typography variant="h3" gutterBottom>Login</Typography>
                <TextField
                    type={"text"}
                    inputRef={usernameRef}
                    className={"mb-3"}
                    fullWidth
                    variant="outlined"
                    disabled={loginSubmitting}
                    placeholder={"Username"} />
                <br />
                <TextField
                    type={"password"}
                    inputRef={passwordRef}
                    className={"mb-3"}
                    variant="outlined"
                    disabled={loginSubmitting}
                    fullWidth
                    placeholder={"Password"} />

                <Grid container spacing={2}>
                    <Grid xs={6} />
                    <Grid xs={3} >
                        <Button component={Link} to={"/"} fullWidth variant="outlined" >Back</Button>
                    </Grid>
                    <Grid xs={3} >
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={loginSubmitting}
                            onClick={login}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
};
