const express = require('express');
const { requireAdmin } = require('../configs/authMiddleware');
const { AuthMiddleware } = require('../configs/authMiddleware');

class UsuarioRoutes {
    constructor(usuarioController) {
        this.usuarioController = usuarioController;
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        // Login para obtener el JWT (Generado por JwtUtil)
        this.router.post('/login', this.usuarioController.login);

        // Registro público (clientes)
        this.router.post('/registro', this.usuarioController.registrar);

        // Perfil del usuario logueado
        this.router.get('/perfil', AuthMiddleware.requireAuth, this.usuarioController.obtenerPerfil);
        this.router.put('/perfil', AuthMiddleware.requireAuth, this.usuarioController.actualizarPerfil);

        // Búsqueda de usuarios (Admin o Empleado)
        this.router.get('/buscar', AuthMiddleware.requireRole([1, 2]), this.usuarioController.buscarUsuariosByRol);

        // Password reset (público)
        this.router.post('/password/solicitar', this.usuarioController.solicitarReset);
        this.router.post('/password/reset', this.usuarioController.resetPassword);

        // ADMIN: gestionar usuarios
        this.router.get('/', requireAdmin, this.usuarioController.listarTodos);
        this.router.get('/:id', requireAdmin, this.usuarioController.obtenerPorId);
        this.router.post('/', requireAdmin, this.usuarioController.crearUsuario);
        this.router.put('/:id/password', requireAdmin, this.usuarioController.resetPasswordAdmin);
        this.router.put('/:id', requireAdmin, this.usuarioController.actualizarUsuario);

        // ADMIN o EMPLEADO pueden eliminar (empleado no puede eliminar admins, controlado en servicio)
        this.router.delete('/:id', AuthMiddleware.requireRole([1,3]), this.usuarioController.eliminarUsuario);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UsuarioRoutes;