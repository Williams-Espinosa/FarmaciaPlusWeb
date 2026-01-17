// backFarmacia/routes/pedidoRoutes.js
const express = require('express');
const upload = require('../configs/multerConfig');
const { AuthMiddleware } = require('../configs/authMiddleware');

class PedidoRoutes {
    constructor(pedidoController) {
        this.pedidoController = pedidoController;
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        // Crear pedido (cliente autenticado)
        this.router.post('/', 
            AuthMiddleware.requireAuth, 
            upload.single('receta'), 
            this.pedidoController.crearPedido
        );

        // Crear pedido MOSTRADOR (admin/empleado)
        this.router.post('/mostrador',
            AuthMiddleware.requireRole([1, 2]),
            this.pedidoController.crearVentaMostrador
        );

        // Listar todos (admin/empleado)
        this.router.get('/',
            AuthMiddleware.requireRole([1, 2]),
            this.pedidoController.listarTodos
        );

        // Listar mis pedidos (cliente autenticado)
        this.router.get('/mis',
            AuthMiddleware.requireAuth,
            this.pedidoController.listarPorUsuario
        );

        // Listar mis productos comprados recientemente
        this.router.get('/mis/productos',
            AuthMiddleware.requireAuth,
            this.pedidoController.listarProductosRecientes
        );

        // Obtener por id (propietario o admin/empleado)
        this.router.get('/:id',
            AuthMiddleware.requireAuth,
            this.pedidoController.obtenerPorId
        );

        // Cancelar pedido (propietario o admin)
        this.router.delete('/:id',
            AuthMiddleware.requireAuth,
            this.pedidoController.cancelarPedido
        );

        // Actualizar pedido (admin)
        this.router.put('/:id',
            AuthMiddleware.requireRole([1]),
            this.pedidoController.actualizarPedido
        );

        this.router.put('/:id/estatus', 
            AuthMiddleware.requireRole([1, 2]), 
            this.pedidoController.actualizarEstatusEnvio
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = PedidoRoutes;