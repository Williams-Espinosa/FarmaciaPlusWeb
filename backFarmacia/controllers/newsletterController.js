class NewsletterController {
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }

    async suscribir(req, res) {
        try {
            const { email, nombre } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'El email es requerido' });
            }
            const suscriptor = await this.newsletterService.suscribir(email, nombre);
            res.status(201).json({ message: 'Suscripción exitosa', suscriptor });
        } catch (error) {
            if (error.message === 'Este correo ya está suscrito') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
    }

    async cancelar(req, res) {
        try {
            const { email } = req.body;
            await this.newsletterService.cancelarSuscripcion(email);
            res.json({ message: 'Suscripción cancelada' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const suscriptores = await this.newsletterService.obtenerTodos();
            res.json(suscriptores);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = NewsletterController;
