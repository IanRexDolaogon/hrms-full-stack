import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar'; 

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);

    return token ? (
        <>
            <Navbar />
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;