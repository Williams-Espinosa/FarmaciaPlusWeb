const JwtUtil = require('./jwtUtil');

class AuthMiddleware {
    static requireAuth(req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = JwtUtil.validarToken(token);
            req.usuarioId = decoded.id;
            req.rol = decoded.rol;
            req.correo = decoded.sub;

            next();
        } catch (error) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
    }

    static requireRole(rolesPermitidos) {
        return (req, res, next) => {
            AuthMiddleware.requireAuth(req, res, () => {
                const roleMap = {
                    1: 'admin', 'admin': 'admin',
                    2: 'empleado', 'empleado': 'empleado',
                    3: 'cliente', 'cliente': 'cliente'
                };
                
                const userRole = roleMap[req.rol] || req.rol;
                const normalizedAllowed = rolesPermitidos.map(r => roleMap[r] || r);

                if (!normalizedAllowed.includes(userRole)) {
                    return res.status(403).json({ message: "No tienes permisos para este recurso" });
                }
                next();
            });
        };
    }
}

const requireAdmin = AuthMiddleware.requireRole([1]);
const requireEmpleado = AuthMiddleware.requireRole([2]);
const requireCliente = AuthMiddleware.requireRole([3]);

module.exports = { AuthMiddleware, requireAdmin, requireCliente, requireEmpleado };