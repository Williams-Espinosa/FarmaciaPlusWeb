const express = require('express');
const { AuthMiddleware } = require('../configs/authMiddleware');

class EstadisticaRoutes {
    constructor(estadisticaController) {
        this.estadisticaController = estadisticaController;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Solo administradores y empleados pueden ver estadísticas
        this.router.get('/dashboard', 
            AuthMiddleware.requireAuth, 
            AuthMiddleware.requireRole([1, 2]), 
            this.estadisticaController.getDashboardStats
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = EstadisticaRoutes;
