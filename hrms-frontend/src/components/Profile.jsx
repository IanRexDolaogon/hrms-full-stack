import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Container, Typography, Card, CardContent, Box, Avatar, Button, 
    Divider, List, ListItem, ListItemText, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [tasks, setTasks] = useState([]); 
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchProfile();
        if (user) {
            fetchMyTasks();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const response = await api.get(`/my-tasks/${user.id}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await api.post('/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(response.data.user);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    if (!profile) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Card sx={{ p: 3, mb: 4 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Avatar 
                        src={profile.avatar_url || ''} 
                        sx={{ width: 120, height: 120, fontSize: '3rem' }}
                    >
                        {!profile.avatar_url && profile.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h4">{profile.name}</Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {profile.email}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button variant="outlined" component="label" size="small">
                                Choose Picture
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </Button>
                            {selectedFile && (
                                <Button variant="contained" onClick={handleUpload} size="small">
                                    Upload
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>My Task History</Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="task history table">
                    <TableHead sx={{ backgroundColor: 'background.default' }}>
                        <TableRow>
                            <TableCell><strong>Task Name</strong></TableCell>
                            <TableCell><strong>Date Assigned</strong></TableCell>
                            <TableCell><strong>Overall Status</strong></TableCell>
                            <TableCell align="right"><strong>My Contribution</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No tasks assigned yet.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body1" fontWeight="500">{task.title}</Typography>
                                    </TableCell>
                                    
                                    <TableCell>
                                        {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                            {task.status.replace('_', ' ').toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell align="right">
                                        <Chip 
                                            label={task.pivot?.status ? task.pivot.status.replace('_', ' ').toUpperCase() : 'PENDING'} 
                                            color={task.pivot?.status === 'completed' ? 'success' : task.pivot?.status === 'in_progress' ? 'warning' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Profile;