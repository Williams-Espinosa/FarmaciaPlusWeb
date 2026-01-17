require('dotenv').config();
const appConfig = require('./configs/appConfig');

async function verifyAll() {
    const testEmail = 'iwdevfull@gmail.com'; // Testing with verified email
    console.log('--- INICIANDO VERIFICACIÓN COMPLETA DE CORREOS ---');

    try {
        // 1. Prueba de Bienvenida (Registro)
        console.log('\n1. Probando correo de BIENVENIDA...');
        await appConfig.emailService.enviarBienvenida(testEmail, {
            nombre: 'Prueba de Sistema',
            email: testEmail,
            password: 'mi_password_seguro',
            direccion: 'Calle Falsa 123'
        });
        console.log('✓ Correo de bienvenida enviado.');

        // 2. Prueba de Newsletter
        console.log('\n2. Probando correo de NEWSLETTER...');
        await appConfig.emailService.enviarAgradecimientoNewsletter(testEmail);
        console.log('✓ Correo de newsletter enviado.');

        // 3. Prueba de Password Reset (Código 6 dígitos)
        console.log('\n3. Probando correo de RESTABLECER CONTRASEÑA...');
        await appConfig.emailService.enviarResetPassword(testEmail, '987654');
        console.log('✓ Correo de restablecimiento enviado.');

        console.log('\n--- VERIFICACIÓN FINALIZADA CON ÉXITO ---');
    } catch (error) {
        console.error('\n!!! ERROR EN LA VERIFICACIÓN:', error);
    } finally {
        process.exit();
    }
}

verifyAll();
