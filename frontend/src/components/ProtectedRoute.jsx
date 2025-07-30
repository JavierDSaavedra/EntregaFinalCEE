import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const userRole = (user?.role || user?.rol || '').toLowerCase();
    const allowed = allowedRoles?.map(r => r.toLowerCase()) || [];
    if (allowedRoles && !allowed.includes(userRole)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
