require('dotenv').config();
const appConfig = require('./configs/appConfig');

async function testNewsletter() {
    console.log('Probando Newsletter desde appConfig...');
    // Usar un email real si se quiere verificar recepción, o uno aleatorio para probar flujo
    const testEmail = 'iwdevfull@gmail.com'; 
    
    try {
        console.log('--- Iniciando flujo de suscripción ---');
        const result = await appConfig.newsletterService.suscribir(testEmail, 'Test User');
        console.log('--- Flujo completado ---');
        console.log('Resultado en DB:', result);
    } catch (error) {
        if (error.message === 'Este correo ya está suscrito') {
            console.log('El correo ya existía, pero el flujo debería haber continuado si no fuera por la validación.');
            // Podríamos borrarlo primero si quisiéramos probar el flujo completo
        }
        console.error('Error en prueba:', error.message);
    } finally {
        process.exit();
    }
}

testNewsletter();
