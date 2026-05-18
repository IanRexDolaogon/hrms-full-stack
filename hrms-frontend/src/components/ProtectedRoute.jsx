import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);

    // If there is no token, redirect to login. Otherwise, render the requested child routes.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;