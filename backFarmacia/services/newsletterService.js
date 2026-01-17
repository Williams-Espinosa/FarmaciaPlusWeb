class NewsletterService {
    constructor(newsletterRepository, emailService) {
        this.newsletterRepository = newsletterRepository;
        this.emailService = emailService;
    }

    async suscribir(email, nombre = null) {
        const existente = await this.newsletterRepository.findByEmail(email);
        if (existente) {
            throw new Error('Este correo ya está suscrito');
        }
        
        const resultado = await this.newsletterRepository.create({ email, nombre });

        // Enviar correo de agradecimiento
        console.log(`Intentando enviar correo de agradecimiento a: ${email}`);
        try {
            if (this.emailService) {
                const mailInfo = await this.emailService.enviarAgradecimientoNewsletter(email);
                console.log('Correo de newsletter enviado con éxito:', mailInfo.messageId);
            } else {
                console.warn('EmailService no está inyectado en NewsletterService');
            }
        } catch (error) {
            console.error('Error detallado al enviar correo de newsletter:', error);
        }

        return resultado;
    }

    async cancelarSuscripcion(email) {
        return await this.newsletterRepository.delete(email);
    }

    async obtenerTodos() {
        return await this.newsletterRepository.findAll();
    }
}

module.exports = NewsletterService;
