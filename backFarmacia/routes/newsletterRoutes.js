const express = require('express');

class NewsletterRoutes {
    constructor(newsletterController) {
        this.router = express.Router();
        this.newsletterController = newsletterController;
        this.initRoutes();
    }

    initRoutes() {
        // POST /api/newsletter/suscribir - Suscribirse al newsletter
        this.router.post('/suscribir', this.newsletterController.suscribir.bind(this.newsletterController));
        
        // POST /api/newsletter/cancelar - Cancelar suscripción
        this.router.post('/cancelar', this.newsletterController.cancelar.bind(this.newsletterController));
        
        // GET /api/newsletter - Obtener todos los suscriptores (admin)
        this.router.get('/', this.newsletterController.obtenerTodos.bind(this.newsletterController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = NewsletterRoutes;
