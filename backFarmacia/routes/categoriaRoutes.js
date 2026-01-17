const express = require('express');
const { requireAdmin } = require('../configs/authMiddleware');

class CategoriaRoutes {
    constructor(categoriaController) {
        this.categoriaController = categoriaController;
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        // Públicas
        this.router.get('/', this.categoriaController.listarTodos);
        this.router.get('/:id', this.categoriaController.obtenerPorId);

        // Admin
        this.router.post('/', requireAdmin, this.categoriaController.crearCategoria);
        this.router.put('/:id', requireAdmin, this.categoriaController.actualizarCategoria);
        this.router.delete('/:id', requireAdmin, this.categoriaController.eliminarCategoria);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = CategoriaRoutes;
