// backFarmacia/controllers/usuarioController.js
const JwtUtil = require('../configs/jwtUtil');

class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    login = async (req, res) => {
        try {
            const { email, password, isGoogle, nombre } = req.body;
            let usuario;
            
            if (isGoogle) {
                usuario = await this.usuarioService.loginGoogle(email, nombre);
            } else {
                usuario = await this.usuarioService.autenticar(email, password);
            }
            
            // Generamos el token igual que en JwtUtil.java
            const token = JwtUtil.generarToken(usuario);
            
            res.json({ 
                token, 
                user: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } 
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(401).json({ error: error.message || "Credenciales inválidas" });
        }
    }

    registrar = async (req, res) => {
    try {
        const datosUsuario = req.body;
        // Llamamos al método registrar del servicio (que ya tiene bcrypt)
        const nuevoUsuarioId = await this.usuarioService.registrar(datosUsuario);
        
        res.status(201).json({ 
            mensaje: "Usuario registrado con éxito", 
            id: nuevoUsuarioId 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

    // Solicitar código de recuperación (público)
    solicitarReset = async (req, res) => {
        try {
            const { email } = req.body;
            await this.usuarioService.solicitarReset(email);
            res.json({ message: 'Código de verificación enviado a tu correo.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Resetear contraseña usando token (público)
    resetPassword = async (req, res) => {
        try {
            const { token, nuevaPassword } = req.body;
            await this.usuarioService.resetPassword(token, nuevaPassword);
            res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // ADMIN: Listar usuarios
    listarTodos = async (req, res) => {
        try {
            const usuarios = await this.usuarioService.listarTodos();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await this.usuarioService.buscarPorId(id);
            res.json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    crearUsuario = async (req, res) => {
        try {
            const usuario = await this.usuarioService.crearUsuario(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    actualizarUsuario = async (req, res) => {
        try {
            const { id } = req.params;
            const actualizado = await this.usuarioService.actualizarUsuario(id, req.body);
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    eliminarUsuario = async (req, res) => {
        try {
            const { id } = req.params;
            await this.usuarioService.eliminarUsuario(id, req.usuarioId, req.rol);
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            const status = error.status || 400;
            res.status(status).json({ error: error.message });
        }
    }

    obtenerPerfil = async (req, res) => {
        try {
            const id = req.usuarioId;
            const usuario = await this.usuarioService.buscarPorId(id);
            res.json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    actualizarPerfil = async (req, res) => {
        try {
            const id = req.usuarioId;
            // No permitimos cambiar el rol desde el perfil propio
            const { rol, ...datos } = req.body;
            const actualizado = await this.usuarioService.actualizarUsuario(id, datos);
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    resetPasswordAdmin = async (req, res) => {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;
            await this.usuarioService.resetPasswordAdmin(id, newPassword);
            res.json({ message: 'Contraseña restablecida y notificada al usuario' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    buscarUsuariosByRol = async (req, res) => {
        try {
            const { rol } = req.query;
            const usuarios = await this.usuarioService.buscarPorRol(rol || 'cliente');
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UsuarioController;