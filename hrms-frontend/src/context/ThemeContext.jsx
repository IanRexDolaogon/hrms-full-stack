import { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    // Check if the user previously chose dark mode, otherwise default to light
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save their preference
    };

    // Dynamically generate the theme based on the current mode
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: mode === 'light' ? '#121212' : '#ffffff' },
            background: {
                default: mode === 'light' ? '#fcfcfc' : '#121212',
                paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
            },
        },
        typography: {
            fontFamily: '"Inter", sans-serif',
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 8 },
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};