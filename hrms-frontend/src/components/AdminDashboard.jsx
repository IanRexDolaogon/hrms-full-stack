import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Container, Typography, TextField, Button, Box, Card, CardContent, 
    Grid, Select, MenuItem, InputLabel, FormControl, Chip, Alert,
    Modal, Divider, LinearProgress 
} from '@mui/material';

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchTasks();
    }, []);

    const fetchEmployees = async () => { 
        const response = await api.get('/users');
        setEmployees(response.data);
    };

    const fetchTasks = async () => { 
        const response = await api.get('/tasks');
        setTasks(response.data);
    };

    const handleCreateTask = async (e) => { 
        e.preventDefault();
        const response = await api.post('/tasks', { title, description, user_ids: selectedUsers });
        setTasks([response.data.task, ...tasks]);
        setTitle(''); setDescription(''); setSelectedUsers([]);
    };

    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setOpenModal(true);
    };

    // ---Remove User ---
    const handleRemoveUser = async (taskId, userId) => {
        try {
            const response = await api.delete(`/tasks/${taskId}/users/${userId}`);
            // Update the master task list with the fresh data from Laravel
            setTasks(tasks.map(t => t.id === taskId ? response.data : t));
            // Update the open modal dynamically
            setSelectedTask(response.data);
        } catch (error) {
            console.error("Failed to remove user", error);
        }
    };

    // --- Calculate Progress ---
    const calculateProgress = (task) => {
        if (!task.users || task.users.length === 0) return 0;
        const completed = task.users.filter(u => u.pivot?.status === 'completed').length;
        return Math.round((completed / task.users.length) * 100);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            
            {/* Create Task Card ... */}
            <Card sx={{ mb: 5, p: 2 }}>
                 <Typography variant="h6" gutterBottom>Create New Task</Typography>
    
                 <Box component="form" onSubmit={handleCreateTask}>
                    <TextField fullWidth required label="Task Title" margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField fullWidth required multiline rows={3} label="Task Description" margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Assign Employees</InputLabel>
                        <Select multiple value={selectedUsers} onChange={(e) => setSelectedUsers(e.target.value)}>
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Create & Assign Task</Button>
                </Box>
            </Card>

            <Typography variant="h5" gutterBottom>All Tasks Overview</Typography>
            <Grid container spacing={3}>
                {tasks.map((task) => {
                    const progress = calculateProgress(task); // Get the percentage

                    return (
                        <Grid item xs={12} key={task.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6">{task.title}</Typography>
                                        <Button variant="outlined" size="small" onClick={() => handleViewDetails(task)}>
                                            Manage Team
                                        </Button>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{task.description}</Typography>
                                    
                                    {/* --- The Progress Bar --- */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                                        <Box sx={{ width: '100%', mr: 2 }}>
                                            <LinearProgress variant="determinate" value={progress} color={progress === 100 ? 'success' : 'primary'} />
                                        </Box>
                                        <Box sx={{ minWidth: 35 }}>
                                            <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 2 }}>
                                        {task.users && task.users.length > 0 ? (
                                            task.users.map(user => <Chip key={user.id} label={user.name} size="small" variant="outlined" />)
                                        ) : (
                                            <Typography variant="body2" color="error">Unassigned</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {/* THE PROGRESS MODAL */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Manage: {selectedTask?.title}</Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    {selectedTask?.users && selectedTask.users.length > 0 ? (
                        selectedTask.users.map(user => (
                            <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography>{user.name}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip 
                                        label={user.pivot?.status ? user.pivot.status.replace('_', ' ').toUpperCase() : 'PENDING'} 
                                        size="small" 
                                        color={user.pivot?.status === 'completed' ? 'success' : 'default'} 
                                    />
                                    {/* --- Remove Button --- */}
                                    <Button size="small" color="error" onClick={() => handleRemoveUser(selectedTask.id, user.id)}>
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No users assigned.</Typography>
                    )}
                    
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Button variant="contained" onClick={() => setOpenModal(false)}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;