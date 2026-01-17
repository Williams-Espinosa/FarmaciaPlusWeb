const BlogPost = require('../models/BlogPost');

class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }

    listarTodos = async (req, res) => {
        try {
            const posts = await this.blogService.listarTodos();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    listarDestacados = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const posts = await this.blogService.listarDestacados(limit);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const post = await this.blogService.obtenerPorId(id);
            res.json(post);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    crearPost = async (req, res) => {
        try {
            const data = {
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                // req.file.path contiene la URL de Cloudinary
                imagen_url: req.file ? req.file.path : req.body.imagen_url,
                destacado: req.body.destacado === 'true' || req.body.destacado === true
            };

            const nuevo = await this.blogService.crearPost(data);
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    actualizarPost = async (req, res) => {
        try {
            const { id } = req.params;
            const data = {
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                // req.file.path contiene la URL de Cloudinary
                imagen_url: req.file ? req.file.path : req.body.imagen_url,
                destacado: req.body.destacado === 'true' || req.body.destacado === true
            };
            const actualizado = await this.blogService.actualizarPost(id, data);
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    eliminarPost = async (req, res) => {
        try {
            const { id } = req.params;
            await this.blogService.eliminarPost(id);
            res.json({ message: 'Post eliminado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = BlogController;
