require('dotenv').config();
const appConfig = require('./configs/appConfig');
const db = require('./configs/DBconfig');

async function debugFlow() {
    const testEmail = 'debug_test@example.com';
    console.log(`--- Iniciando depuración para: ${testEmail} ---`);
    
    try {
        // 1. Limpiar si existe
        console.log('1. Limpiando email de prueba si existe...');
        await db.query('DELETE FROM suscriptor_newsletter WHERE email = ?', [testEmail]);
        
        // 2. Suscribir usando el servicio real
        console.log('2. Llamando a NewsletterService.suscribir...');
        const result = await appConfig.newsletterService.suscribir(testEmail, 'Debug User');
        console.log('3. Resultado de suscripción:', result);
        
        console.log('--- Depuración completada con éxito ---');
    } catch (error) {
        console.error('!!! Error en el flujo de depuración:', error);
    } finally {
        await db.end();
        process.exit();
    }
}

debugFlow();
