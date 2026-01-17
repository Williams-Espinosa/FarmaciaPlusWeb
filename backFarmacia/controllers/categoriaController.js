class CategoriaController {
    constructor(categoriaService) {
        this.categoriaService = categoriaService;
    }

    listarTodos = async (req, res) => {
        try {
            const cats = await this.categoriaService.listarTodos();
            res.json(cats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const cat = await this.categoriaService.obtenerPorId(id);
            res.json(cat);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    crearCategoria = async (req, res) => {
        try {
            const nuevo = await this.categoriaService.crearCategoria(req.body);
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    actualizarCategoria = async (req, res) => {
        try {
            const { id } = req.params;
            const actualizado = await this.categoriaService.actualizarCategoria(id, req.body);
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    eliminarCategoria = async (req, res) => {
        try {
            const { id } = req.params;
            await this.categoriaService.eliminarCategoria(id);
            res.json({ message: 'Categoría eliminada' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CategoriaController;
