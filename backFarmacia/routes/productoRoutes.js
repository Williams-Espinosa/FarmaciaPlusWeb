const express = require('express');
const upload = require('../configs/multerConfig');
const { requireAdmin } = require('../configs/authMiddleware');

class ProductoRoutes {
    constructor(productoController) {
        this.productoController = productoController;
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        // Listar catálogo (Público)
        this.router.get('/', this.productoController.listarTodos);

        // Buscar por código de barras (Para el escáner del vendedor/cliente)
        this.router.get('/buscar/:codigo', this.productoController.buscarPorCodigo);

        // Obtener producto por id (Público)
        this.router.get('/:id', this.productoController.obtenerPorId);

        // Crear producto (Solo admin)
        this.router.post('/', requireAdmin, upload.single('imagen'), this.productoController.crearProducto);

        // Actualizar producto (Solo admin)
        this.router.put('/:id', requireAdmin, upload.single('imagen'), this.productoController.actualizarProducto);

        // Eliminar producto (Solo admin)
        this.router.delete('/:id', requireAdmin, this.productoController.eliminarProducto);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProductoRoutes;