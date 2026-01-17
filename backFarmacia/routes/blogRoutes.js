const express = require('express');
const upload = require('../configs/multerConfig');
const { requireAdmin, AuthMiddleware } = require('../configs/authMiddleware');

class BlogRoutes {
    constructor(blogController) {
        this.blogController = blogController;
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        // Públicos
        this.router.get('/', this.blogController.listarTodos);
        this.router.get('/destacados', this.blogController.listarDestacados);
        this.router.get('/:id', this.blogController.obtenerPorId);

        // Admin CRUD
        this.router.post('/', requireAdmin, upload.single('imagen'), this.blogController.crearPost);
        this.router.put('/:id', requireAdmin, upload.single('imagen'), this.blogController.actualizarPost);
        this.router.delete('/:id', requireAdmin, this.blogController.eliminarPost);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = BlogRoutes;
