const express = require('express');
const StripeService = require('../services/StripeService');
const PagoController = require('../controllers/PagoController');
const PedidoRepository = require('../repositories/pedidoRepository');
const PagoTarjetaRepository = require('../repositories/PagoTarjetaRepository');
const PagoOxxoRepository = require('../repositories/pagoOxxoRepository');
const db = require('../configs/DBconfig');
const { requireAuth } = require('../configs/authMiddleware');

class PagoRoutes {
    constructor() {
        this.router = express.Router();
        this.stripeService = new StripeService();
        this.pedidoRepo = new PedidoRepository(db);
        this.pagoTarjetaRepo = new PagoTarjetaRepository(db);
        this.pagoOxxoRepo = new PagoOxxoRepository(db);
        this.pagoController = new PagoController(
            this.stripeService,
            this.pedidoRepo,
            this.pagoTarjetaRepo,
            this.pagoOxxoRepo
        );
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Crear intención de pago
        this.router.post(
            '/create-intent',
            requireAuth,
            this.pagoController.crearPaymentIntent
        );

        // Webhook de Stripe (NO requiere autenticación, Stripe lo llama)
        // IMPORTANTE: Este endpoint necesita el body RAW, se configura en server.js
        this.router.post(
            '/webhook',
            express.raw({ type: 'application/json' }),
            this.pagoController.webhookStripe
        );

        // Consultar estado de pago
        this.router.get(
            '/:pedidoId/status',
            requireAuth,
            this.pagoController.consultarEstadoPago
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new PagoRoutes().getRouter();
