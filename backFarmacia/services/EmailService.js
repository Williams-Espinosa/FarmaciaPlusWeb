const transporter = require('../configs/mailer');

class EmailService {
    async enviarConfirmacionPago(emailUsuario, referencia, total) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "Pago Confirmado - Tu pedido está en preparación",
            html: `
                <h1>¡Gracias por tu pago!</h1>
                <p>Tu pago por la referencia <b>${referencia}</b> ha sido recibido.</p>
                <p>Monto: $${total} MXN</p>
                <p>Estatus actual: <b>En preparación</b></p>
            `
        };
        return await transporter.sendMail(opciones);
    }

    async enviarConfirmacionPedido(emailUsuario, pedidoId) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: `Confirmación de Pedido #${pedidoId} - SuperFarmacia`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">¡Gracias por tu compra!</h1>
                    <p>Tu pedido <b>#${pedidoId}</b> ha sido recibido exitosamente.</p>
                    <p>Estamos procesando tu orden y te notificaremos cuando esté lista o enviada.</p>
                    <br>
                    <p>Gracias por confiar en SuperFarmacia.</p>
                </div>
            `
        };
        return await transporter.sendMail(opciones);
    }

    async enviarCambioTracking(emailUsuario, nuevoEstatus) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "Nuevo Estatus - Tu pedido está en camino",
            html: `
                <h1>¡Tu pedido ha cambiado de estatus!</h1>
                <p>El estatus de tu pedido ahora es: <b>${nuevoEstatus}</b></p>
            `
        };
        return await transporter.sendMail(opciones);
    }
    
    async enviarEntregaConfirmada(emailUsuario, nuevoEstatus) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "Pedido Entregado - Gracias por comprar con nosotros",
            html: `
                <h1>¡Tu pedido ha sido entregado!</h1>
                <p>El estatus de tu pedido ahora es: <b>${nuevoEstatus}</b></p>
            `
        };
        return await transporter.sendMail(opciones);
    }

    async enviarResetPassword(emailUsuario, codigo) {
        const opciones = {
            from: `"SuperFarmacia - Seguridad" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "Código de recuperación - SuperFarmacia 🔑",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f9; padding: 20px; border-radius: 20px;">
                    <div style="background: #2563eb; color: white; padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Restablecer Contraseña</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en SuperFarmacia. 
                            Usa el siguiente código de verificación para continuar:
                        </p>
                        
                        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                            <span style="font-size: 36px; font-weight: bold; color: #1e40af; letter-spacing: 12px; font-family: monospace;">
                                ${codigo}
                            </span>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px; text-align: center;">
                            Este código expirará en 3 minutos por tu seguridad.
                        </p>
                        
                        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                            <br><br>
                            <b>SuperFarmacia © 2025</b>
                        </p>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(opciones);
    }

    async enviarNotificacionPromocion(emailUsuario, promocion) {
        const descuentoTexto = promocion.tipo === '2x1' ? '2x1' : 
                            promocion.tipo === 'combo' ? 'Combo especial' :
                            `${promocion.descuento}% de descuento`;
        
        const opciones = {
            from: `"SuperFarmacia - Promociones" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: ` ¡Nueva Promoción! ${promocion.titulo} - FarmaPlus`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #2563eb, #2563eb); color: white; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 ¡Nueva Promoción!</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #1e40af; margin-top: 0;">${promocion.titulo}</h2>
                        <p style="color: #4b5563; font-size: 16px;">${promocion.descripcion || 'Aprovecha esta increíble oferta por tiempo limitado.'}</p>
                        
                        <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #1e40af; font-size: 18px; font-weight: bold;">
                                ${descuentoTexto}
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            📅 Válido del ${new Date(promocion.fecha_inicio).toLocaleDateString()} al ${new Date(promocion.fecha_fin).toLocaleDateString()}
                        </p>
                        
                        <div style="text-align: center; margin-top: 25px;">
                            <a href="http://localhost:5173/promociones" 
                            style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                                Ver Promoción
                            </a>
                        </div>
                    </div>
                    
                    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
                        Recibes este correo porque estás suscrito a nuestro newsletter.
                        <br>FarmaPlus © 2025
                    </p>
                </div>
            `
        };
        return await transporter.sendMail(opciones);
    }

    async enviarAgradecimientoNewsletter(emailUsuario) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "¡Gracias por suscribirte! 📩 SuperFarmacia",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f9; padding: 20px; border-radius: 20px;">
                    <div style="background: #2563eb; color: white; padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">¡Gracias por unirte!</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
                            ¡Es un gusto tenerte con nosotros! A partir de ahora serás el primero en recibir nuestras ofertas exclusivas, consejos de salud y lanzamientos de nuevos productos.
                        </p>
                        
                        <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                            <p style="margin: 0; color: #1e40af; font-weight: bold; font-size: 18px;">
                                ¡Mantente atento a tu bandeja de entrada!
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/promociones" 
                            style="display: inline-block; background: #2563eb; color: white; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                                Explorar Ofertas Actuales
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si no querías suscribirte, puedes cancelar tu suscripción en cualquier momento.
                            <br><br>
                            <b>SuperFarmacia © 2025</b>
                        </p>
                    </div>
                </div>
            `
        };
        console.log(`Preparando opciones de correo para newsletter: ${emailUsuario}`);
        return await transporter.sendMail(opciones);
    }

    async enviarBienvenida(emailUsuario, datos) {
        const opciones = {
            from: `"SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "¡Bienvenida a SuperFarmacia! 🎉 Tu salud, nuestra prioridad",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f9; padding: 20px; border-radius: 20px;">
                    <div style="background: linear-gradient(135deg, #2563eb, #2563eb); color: white; padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">¡Hola, ${datos.nombre}!</h1>
                        <p style="font-size: 18px; opacity: 0.9; margin-top: 10px;">Bienvenida a SuperFarmacia</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Le agradecemos su preferencia. Le enviamos sus credenciales de acceso para que pueda mantenerse en línea y disfrutar de todos nuestros beneficios.
                        </p>
                        
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
                            <h3 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #dbeafe; padding-bottom: 10px;">Sus Datos de Acceso:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 100px;">Nombre:</td>
                                    <td style="padding: 8px 0; color: #1e293b;">${datos.nombre}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Correo:</td>
                                    <td style="padding: 8px 0; color: #1e293b;">${datos.email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Contraseña:</td>
                                    <td style="padding: 8px 0; color: #1e293b; font-family: monospace; background: #eef2ff; padding: 4px 8px; border-radius: 4px;">${datos.password}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Dirección:</td>
                                    <td style="padding: 8px 0; color: #1e293b;">${datos.direccion}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" 
                            style="display: inline-block; background: #2563eb; color: white; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; transition: background 0.3s;">
                                Iniciar Sesión Ahora
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si tiene alguna duda, responda a este correo o contáctenos por WhatsApp.
                            <br><br>
                            <b>SuperFarmacia © 2025</b>
                        </p>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(opciones);
    }
    async enviarPasswordResetAdmin(emailUsuario, nombre, nuevaPassword) {
        const opciones = {
            from: `"SuperFarmacia - Seguridad" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "Su contraseña ha sido restablecida - SuperFarmacia 🔑",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f9; padding: 20px; border-radius: 20px;">
                    <div style="background: #2563eb; color: white; padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Contraseña Actualizada</h1>
                        <p style="margin-top: 10px; opacity: 0.9;">Hola, ${nombre}</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Un administrador ha generado una nueva contraseña para su cuenta de SuperFarmacia. 
                            Por favor, use la siguiente clave para su próximo inicio de sesión:
                        </p>
                        
                        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                            <span style="font-size: 28px; font-weight: bold; color: #1e40af; font-family: monospace; letter-spacing: 2px;">
                                ${nuevaPassword}
                            </span>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px; text-align: center;">
                            Le recomendamos cambiar esta contraseña una vez que haya iniciado sesión por primera vez.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173/login" 
                            style="display: inline-block; background: #2563eb; color: white; padding: 14px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                                Ir al Login
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            <b>SuperFarmacia © 2025</b>
                        </p>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(opciones);
    }
}

module.exports = EmailService;