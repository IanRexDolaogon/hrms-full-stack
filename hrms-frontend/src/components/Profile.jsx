import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Container, Typography, Card, CardContent, Button, 
    Avatar, Box, Alert, CircularProgress 
} from '@mui/material';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await api.post('/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setMessage('Profile picture updated successfully!');
            setProfile({ ...profile, avatar_url: response.data.avatar_url });
            setSelectedFile(null); 
        } catch (error) {
            setMessage('Upload failed. Ensure it is an image under 2MB.');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <Box sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>My Profile</Typography>
                    
                    {message && <Alert severity={message.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
                        <Avatar 
                            src={profile.avatar_url || ''} 
                            sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                        >
                            {!profile.avatar_url && profile.name.charAt(0)}
                        </Avatar>
                        
                        <Typography variant="h6">{profile.name}</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>{profile.email}</Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Role: <strong>{profile.roles.join(', ').toUpperCase()}</strong>
                        </Typography>

                        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                            Select New Picture
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>

                        {selectedFile && (
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Selected: {selectedFile.name}
                            </Typography>
                        )}

                        <Button 
                            variant="contained" 
                            color="primary" 
                            disabled={!selectedFile || loading} 
                            onClick={handleUpload}
                        >
                            {loading ? 'Uploading...' : 'Upload Picture'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;