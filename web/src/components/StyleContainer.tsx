import React from "react"
import {createTheme, ThemeProvider, useMediaQuery} from "@mui/material";

export const darkenRgb = (inRgb: string, factor: number): string => {
    const raw = inRgb.replace("rgb(", "").replace(")", "")
    const [r, g, b] = raw.split(",").map(c => Math.floor(+c * factor));
    return `rgb(${r}, ${g}, ${b})`
}

export const buildBackgroundImageSVG = (darkMode: boolean): JSX.Element => {
    const colorScheme = darkMode
        ? ["rgb(33, 38, 51)", "rgb(60, 71, 95)", "rgb(104, 118, 141)", "rgb(141, 160, 186)", "rgb(184, 205, 230)"]
        : ["rgb(239, 228, 205)", "rgb(204, 192, 173)", "rgb(172, 160, 141)", "rgb(148, 138, 118)", "rgb(123, 123, 112)"];

    const darkenFactor = darkMode ? 0.3 : 1.2

    return <svg viewBox="0 0 200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
                className={"background-waves"}>
        <defs>
            <linearGradient id="lg_first" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor={colorScheme[1]} />
                <stop offset="95%" stopColor={darkenRgb(colorScheme[1], darkenFactor)} />
            </linearGradient>
            <linearGradient id="lg_second" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor={colorScheme[2]} />
                <stop offset="95%" stopColor={darkenRgb(colorScheme[2], darkenFactor)} />
            </linearGradient>
            <linearGradient id="lg_third" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor={colorScheme[3]} />
                <stop offset="95%" stopColor={darkenRgb(colorScheme[3], darkenFactor)} />
            </linearGradient>
            <linearGradient id="lg_fourth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor={colorScheme[4]} />
                <stop offset="95%" stopColor={darkenRgb(colorScheme[4], darkenFactor)} />
            </linearGradient>
        </defs>
        <rect height="100%" width="100%" fill={colorScheme[0]}/>
        <g className={"first"}>
            <path d="M 0,30 t 10,5 t 10,-10 t 10,-15 t 10,-10 L 100,0 L 100,100 L 0,100" fill={"url(#lg_first)"}/>
        </g>
        <g className={"second"}>
            <path d="M 0,55 t 20,10 t 20,-30 t 20,-25 t 20,0 t 15,-10 L 100,0 L 100,100 L 0,100" fill={"url(#lg_second)"}/>
        </g>
        <g className={"third"}>
            <path d="M 10,100 t 5,-10 t 20,-5 t 20,0 t 5,-20 t 5,-20 t 20,-10 t 15,-30 L 100,0 L 100,100 L 0,100" fill={"url(#lg_third)"}/>
        </g>
        <g className={"fourth"}>
            <path d="M 65,100 t 10,-10 t 10,-20 t 5,-20 t 10,-10 L 100,0 L 100,100 L 0,100" fill={"url(#lg_fourth)"}/>
        </g>
    </svg>
}

// Light brown something
export const jnlLightModeTheme = createTheme({
    typography: {
        fontFamily: 'go, monospace',
        button: {
            textTransform: 'none'
        }
    },
    palette: {
        mode: 'light',
        primary: {
            main: "#6d6959"
        }
    }
})

// Blue/brown stuff
export const jnlDarkModeTheme = createTheme({
    typography: {
        fontFamily: 'go, monospace', button: {
            textTransform: 'none'
        }
    },
    palette: {
        mode: 'dark',
        primary: {
            main: "#37474f"
        }
    }
})

export const StyleContainer: React.FC<React.ReactNode> = ({children}): JSX.Element => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            prefersDarkMode ? jnlDarkModeTheme : jnlLightModeTheme,
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <>
                {buildBackgroundImageSVG(prefersDarkMode)}
                {children}
            </>
        </ThemeProvider>
    )
}