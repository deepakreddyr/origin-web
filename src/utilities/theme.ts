// app/theme.ts
'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1150,
            xl: 1450,
        },
    },
    typography: {
        fontFamily: 'Stinger, sans-serif',
        body1: {
            fontFamily: 'SofiaPro, sans-serif',
        },
        button: {
            fontFamily: 'SofiaPro, sans-serif',
        },
    },
    palette: {
        primary: {
            main: '#FFDD00',
            100: '#F8F4E9',
            200: '#EDE6D4',
        },
        secondary: {
            main: '#25874D',
            100: '#DDEEDD',
            200: '#CFE6D2',
            300: '#26B45F',
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingInline: '20px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: 'fit-content',
                },
            },
        },
    },
})

export default theme
