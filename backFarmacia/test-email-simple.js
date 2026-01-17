require('dotenv').config();
const transporter = require('./configs/mailer');

async function testEmail() {
    console.log('Probando envío de correo...');
    console.log('Usuario:', process.env.EMAIL_USER);
    
    try {
        const info = await transporter.sendMail({
            from: `"Test SuperFarmacia" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Enviarse a sí mismo para probar
            subject: "Prueba de Conexión SMTP",
            text: "Si recibes esto, la configuración de correo funciona correctamente.",
            html: "<b>Si recibes esto, la configuración de correo funciona correctamente.</b>"
        });
        console.log('Correo enviado con éxito:', info.messageId);
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
}

testEmail();
