import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Container, Typography, Card, CardContent, CardActions, 
    Button, Grid, Chip, Box, Divider, LinearProgress 
} from '@mui/material';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMyTasks();
        }
    }, [user]);

    const fetchMyTasks = async () => {
        try {
            const response = await api.get(`/my-tasks/${user.id}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            
            setTasks(tasks.map(task => 
                task.id === taskId 
                ? { 
                    ...task, 
                    status: response.data.global_status, 
                    pivot: { ...task.pivot, status: newStatus },
                    users: task.users.map(u => 
                        u.id === user.id ? { ...u, pivot: { ...u.pivot, status: newStatus } } : u
                    )
                  } 
                : task
            ));
        } catch (error) {
            console.error("Failed to update status", error);
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
            <Typography variant="h4" gutterBottom>My Work Board</Typography>
            <Grid container spacing={3}>
                
                {tasks.length === 0 ? (
                    <Typography sx={{ mt: 2, ml: 3 }}>
                        You have no assigned tasks right now. Great job!
                    </Typography>
                ) : (
                    tasks.map((task) => {
                        const progress = calculateProgress(task); // Get the percentage

                        return (
                            <Grid item xs={12} sm={6} key={task.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom>{task.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {task.description}
                                        </Typography>
                                        
                                        {/* --- The Progress Bar --- */}
                                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Team Progress:</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ width: '100%', mr: 2 }}>
                                                <LinearProgress variant="determinate" value={progress} color={progress === 100 ? 'success' : 'primary'} />
                                            </Box>
                                            <Box sx={{ minWidth: 35 }}>
                                                <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1.5 }} />

                                        {/* Overall Task Status */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Global Status:</Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {task.status.replace('_', ' ').toUpperCase()}
                                            </Typography>
                                        </Box>

                                        {/* My Personal Pivot Status */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2">My Progress:</Typography>
                                            <Chip 
                                                label={task.pivot?.status ? task.pivot.status.replace('_', ' ').toUpperCase() : 'PENDING'} 
                                                color={task.pivot?.status === 'completed' ? 'success' : task.pivot?.status === 'in_progress' ? 'warning' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                    </CardContent>
                                    
                                    {/* Action Buttons */}
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        {task.pivot?.status === 'pending' && (
                                            <Button 
                                                size="small" variant="outlined" color="warning" fullWidth
                                                onClick={() => handleStatusChange(task.id, 'in_progress')}
                                            >
                                                Start My Portion
                                            </Button>
                                        )}
                                        {task.pivot?.status === 'in_progress' && (
                                            <Button 
                                                size="small" variant="contained" color="success" fullWidth
                                                onClick={() => handleStatusChange(task.id, 'completed')}
                                            >
                                                Mark My Part Completed
                                            </Button>
                                        )}
                                        {task.pivot?.status === 'completed' && (
                                            <Button size="small" variant="text" disabled fullWidth>
                                                Waiting on team...
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                )}

            </Grid>
        </Container>
    );
};

export default EmployeeDashboard;