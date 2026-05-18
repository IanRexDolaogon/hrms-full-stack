import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Profile from './components/Profile';


function App() {
    const { user } = useContext(AuthContext);

    // Helper function to check role safely
    const isAdmin = user?.roles?.some(role => role.name === 'admin');

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                
                {/* Dynamic Home Route based on Role */}
                <Route path="/" element={
                    isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
                } />
                
                {/* Profile */}
                <Route path="/profile" element={<Profile />} />
                
            </Route>
        </Routes>
    );
}

export default App;