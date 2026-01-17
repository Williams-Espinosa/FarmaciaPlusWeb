const crypto = require('crypto');
const bcrypt = require('bcrypt');

class UsuarioService {
    constructor(usuarioRepository, emailService, passwordResetRepository) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.passwordResetRepository = passwordResetRepository;
    }

    async loginGoogle(email, nombre) {
        let usuario = await this.usuarioRepository.findByEmail(email);
        
        if (!usuario) {
            // Si el usuario no existe, lo creamos (Registro por Google)
            const nuevoId = await this.usuarioRepository.create({
                nombre: nombre || 'Usuario Google',
                email: email,
                password: 'GOOGLE_AUTH_PWD', // Password placeholder
                rol: 3
            });
            usuario = await this.usuarioRepository.findById(nuevoId);

            // Enviar correo de bienvenida (sin contraseña real)
            try {
                await this.emailService.enviarBienvenida(email, {
                    nombre: usuario.nombre,
                    email: email,
                    password: 'Haber iniciado sesión con Google',
                    direccion: 'Pendiente de actualizar'
                });
            } catch (err) {
                console.error('Error sending welcome email (Google):', err);
            }
        }

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };
    }

    async autenticar(email, password) {
        const usuario = await this.usuarioRepository.findByEmail(email);
        
        if (!usuario) {
            throw new Error("El usuario no existe");
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        
        if (!esValida) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol 
        };
    }

    async registrar(datos) {
        const plainPassword = datos.password; // Capture plain password for email
        
        // Create a copy of datos to hash the password without affecting the original object used for email
        const userToCreate = { ...datos };
        const salt = await bcrypt.genSalt(10);
        userToCreate.password = await bcrypt.hash(userToCreate.password, salt);
        
        const nuevoUsuarioId = await this.usuarioRepository.create(userToCreate);

        // Send welcome email
        try {
            if (this.emailService) {
                await this.emailService.enviarBienvenida(datos.email, {
                    nombre: datos.nombre,
                    email: datos.email,
                    password: plainPassword,
                    direccion: datos.direccion
                });
            }
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
        }

        return nuevoUsuarioId;
    }

    async listarTodos() {
        return await this.usuarioRepository.findAll();
    }

    async buscarPorId(id) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) throw new Error('Usuario no encontrado');
        return usuario;
    }

    async crearUsuario(datos) {
        const plainPassword = datos.password;
        // Hash de la contraseña si existe
        if (datos.password) {
            const salt = await bcrypt.genSalt(10);
            datos.password = await bcrypt.hash(datos.password, salt);
        } else {
            throw new Error('La contraseña es obligatoria');
        }

        const id = await this.usuarioRepository.create(datos);

        // Enviar correo de bienvenida
        try {
            await this.emailService.enviarBienvenida(datos.email, {
                nombre: datos.nombre,
                email: datos.email,
                password: plainPassword,
                direccion: datos.direccion || 'No especificada'
            });
        } catch (err) {
            console.error('Error sending welcome email from admin:', err);
        }

        return await this.buscarPorId(id);
    }

    async actualizarUsuario(id, datos) {
        // Si hay contraseña, hashearla
        if (datos.password) {
            const salt = await bcrypt.genSalt(10);
            datos.password = await bcrypt.hash(datos.password, salt);
        }
        return await this.usuarioRepository.update(id, datos);
    }

    async eliminarUsuario(id, requesterId, requesterRol) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) throw new Error('Usuario no encontrado');

        // Evitar que un empleado elimine un admin
        if (usuario.rol === 1 && requesterRol !== 1) {
            const err = new Error('No tienes permisos para eliminar a este usuario');
            err.status = 403;
            throw err;
        }

        // Evitar que un admin se elimine a sí mismo (opcional)
        if (id === requesterId && requesterRol === 1) {
            const err = new Error('Un admin no puede eliminarse a sí mismo');
            err.status = 400;
            throw err;
        }

        const success = await this.usuarioRepository.delete(id);
        if (!success) throw new Error('No se pudo eliminar el usuario');
        return true;
    }

    // Solicitar restablecimiento de contraseña (si el email existe se envía código)
    async solicitarReset(email) {
        const usuario = await this.usuarioRepository.findByEmail(email);

        if (!usuario) {
            throw new Error('Este correo electrónico no está registrado en nuestro sistema');
        }

        // Generar código de 6 dígitos
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 3 * 60 * 1000); // 3 minutos

        await this.passwordResetRepository.createToken(usuario.id, token, expiracion);

        await this.emailService.enviarResetPassword(usuario.email, token);

        return true;
    }

    // Resetea la contraseña usando el código/token
    async resetPassword(token, nuevaPassword) {
        const registro = await this.passwordResetRepository.findByToken(token);
        
        if (!registro) {
            throw new Error('El código es inválido');
        }
        
        if (registro.used) {
            throw new Error('Este código ya ha sido utilizado');
        }
        
        if (new Date(registro.expiracion) < new Date()) {
            throw new Error('El código ha expirado');
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(nuevaPassword, salt);

        await this.usuarioRepository.update(registro.usuario_id, { password: hashed });

        await this.passwordResetRepository.markUsed(registro.id);

        return true;
    }

    async resetPasswordAdmin(id, nuevaPassword) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) throw new Error('Usuario no encontrado');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(nuevaPassword, salt);
        
        await this.usuarioRepository.update(id, { password: hashed });

        // Enviar notificación por email
        try {
            await this.emailService.enviarPasswordResetAdmin(usuario.email, usuario.nombre, nuevaPassword);
        } catch (err) {
            console.error('Error sending admin reset email:', err);
        }

        return true;
    }

    async buscarPorRol(rol) {
        return await this.usuarioRepository.findByRole(rol);
    }
}

module.exports = UsuarioService;