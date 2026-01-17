const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "clave_super_secreta_muy_segura_de_32_bytes";

class JwtUtil {
    static generarToken(usuario) {
        const payload = {
            id: usuario.id,
            rol: usuario.rol, // 1: Admin, 2: Cliente, 3: Empleado
            sub: usuario.email
        };
        // Expira en 8 horas
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
    }

    // ValidarToken
    static validarToken(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            throw new Error("Token inválido o expirado");
        }
    }
}

module.exports = JwtUtil;