import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Container, Typography, Grid, Card, Avatar, Box, Chip, 
    Button, Modal, Divider, TextField, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const TeamDirectory = () => {
    // Bring in AuthContext to check if the current viewer is an Admin
    const { user: currentUser } = useContext(AuthContext);
    const isAdmin = currentUser?.roles?.some(role => role.name === 'admin');

    const [team, setTeam] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    
    // State for the Edit Form
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('employee');

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            // Ask Laravel to send the users WITH their roles attached
            const response = await api.get('/users?with=roles');
            setTeam(response.data);
        } catch (error) {
            console.error("Failed to load team directory", error);
        }
    };

    // --- ADMIN ACTIONS ---
    const handleOpenEdit = (member) => {
        setEditId(member.id);
        setEditName(member.name);
        setEditEmail(member.email);
        // Safely check what role they currently have
        setEditRole(member.roles?.[0]?.name || 'employee'); 
        setOpenModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/users/${editId}`, {
                name: editName,
                email: editEmail,
                role: editRole
            });
            
            // Update the UI immediately
            setTeam(team.map(t => t.id === editId ? response.data : t));
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to update employee", error);
        }
    };

    const handleDeleteUser = async (memberId) => {
        if (!window.confirm("Are you sure you want to terminate this employee? This cannot be undone.")) return;
        
        try {
            await api.delete(`/users/${memberId}`);
            setTeam(team.filter(t => t.id !== memberId)); // Remove from UI
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete user");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>Team Directory</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {isAdmin ? "Manage your workforce and organization roles." : "Meet the people powering our workspace."}
            </Typography>

           <Grid container spacing={3}>
                {team.map((member) => {
                    // Safely extract the role name BEFORE trying to render it
                    const roleName = member.roles?.[0]?.name || 'employee';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar 
                                        src={member.avatar_url || ''} 
                                        sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main', border: '1px solid #eee' }}
                                    >
                                        {!member.avatar_url && member.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{member.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{member.email}</Typography>
                                        
                                        {/* Safely use the extracted roleName here */}
                                        <Chip 
                                            label={roleName.toUpperCase()} 
                                            size="small" 
                                            color={roleName === 'admin' ? 'error' : 'primary'}
                                            variant="outlined" 
                                        />
                                    </Box>
                                </Box>

                                {/* ONLY SHOW THESE BUTTONS TO ADMINS */}
                                {isAdmin && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
                                        <Button size="small" variant="outlined" fullWidth onClick={() => handleOpenEdit(member)}>
                                            Edit
                                        </Button>
                                        <Button 
                                            size="small" variant="outlined" color="error" fullWidth 
                                            onClick={() => handleDeleteUser(member.id)}
                                            disabled={currentUser.id === member.id}
                                        >
                                            Terminate
                                        </Button>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* THE EDIT EMPLOYEE MODAL */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Edit Employee</Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box component="form" onSubmit={handleUpdateUser}>
                        <TextField fullWidth required label="Full Name" margin="normal" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <TextField fullWidth required type="email" label="Email Address" margin="normal" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-select-label">System Role</InputLabel>
                            <Select labelId="role-select-label" value={editRole} label="System Role" onChange={(e) => setEditRole(e.target.value)}>
                                <MenuItem value="employee">Employee (Standard Access)</MenuItem>
                                <MenuItem value="admin">Admin (Full Access)</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default TeamDirectory;