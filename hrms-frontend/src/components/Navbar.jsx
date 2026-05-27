import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import api from '../api/axios';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { token, user } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState('');

    // Fetch the tiny avatar for the navbar when they log in
    useEffect(() => {
        if (token) {
            fetchTinyProfile();
        }
    }, [token]);

    const fetchTinyProfile = async () => {
        try {
            const response = await api.get('/profile');
            setAvatarUrl(response.data.avatar_url);
        } catch (error) {
            console.error("Failed to load navbar avatar", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; 
    };
    const { mode, toggleTheme } = useContext(ThemeContext);

    if (!token) return null;

    return (
        <AppBar position="sticky" sx={{ top: 0, zIndex: 1100, mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    HRMS Workspace
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/team">
                        Team
                    </Button>
                    <Button color="inherit" component={Link} to="/profile">Profile</Button>
                    {/* The New Navbar Avatar */}
                    <Avatar 
                        src={avatarUrl || ''} 
                        sx={{ width: 35, height: 35, border: '2px solid #eeeeee' }}
                    >
                        {/* Fallback to first letter of name if no picture exists */}
                        {!avatarUrl && user?.name?.charAt(0)}
                    </Avatar>
                    <Button color="inherit" onClick={toggleTheme}>
                        {mode === 'light' ? 'Dark' : 'Light'}
                    </Button>

                    <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;