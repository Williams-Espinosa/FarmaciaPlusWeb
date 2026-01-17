// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, rolesPermitidos }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) return <Navigate to="/login" />;

    // Mapeo flexible para soportar tanto IDs como strings
    const roleMap = {
        1: 'admin',
        2: 'empleado',
        3: 'cliente',
        'admin': 'admin',
        'empleado': 'empleado',
        'cliente': 'cliente'
    };

    const userRole = roleMap[user.rol] || user.rol;

    if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
        return <Navigate to="/" />; // Redirigir a Home en lugar de unauthorized inexistente
    }

    return children;
};

export default ProtectedRoute;