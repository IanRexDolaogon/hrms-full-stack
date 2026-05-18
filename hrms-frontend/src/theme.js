import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#121212', // Deep charcoal/almost black for primary actions
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#757575', // Clean gray for secondary actions
            contrastText: '#ffffff',
        },
        background: {
            default: '#fcfcfc', // Very soft off-white background
            paper: '#ffffff', // Crisp white cards
        },
        text: {
            primary: '#1c1c1c',
            secondary: '#616161',
        },
        // We will keep subtle colors for status indicators
        success: { main: '#2e7d32' },
        warning: { main: '#ed6c02' },
        error: { main: '#d32f2f' },
    },
    typography: {
        // Inter is a fantastic modern, clean font
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none', // Disables default ALL CAPS on buttons
            fontWeight: 600,
        },
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h5: {
            fontWeight: 600,
            letterSpacing: '-0.3px',
        },
        h6: {
            fontWeight: 600,
        }
    },
    shape: {
        borderRadius: 6, // Slightly sharper, cleaner corners
    },
    components: {
        // Globally override specific MUI components
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Flat design
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', // Extremely subtle depth
                    border: '1px solid #eeeeee', // Clean outline
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff', // Clean white navbar
                    color: '#121212', // Black text/icons
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#e0e0e0', // Softer input borders
                        },
                    },
                },
            },
        },
    },
});

export default theme;