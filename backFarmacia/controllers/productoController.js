class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    buscarPorCodigo = async (req, res) => {
        try {
            const { codigo } = req.params;
            const producto = await this.productoService.buscarPorCodigo(codigo);
            res.json(producto);
        } catch (error) {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    }

    listarTodos = async (req, res) => {
        try {
            const productos = await this.productoService.listarCatalogo();
            res.json(productos);
        } catch (error) {
            console.error("Error en listarTodos:", error);
            res.status(500).json({ error: error.message, stack: error.stack });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await this.productoService.buscarPorId(id);
            res.json(producto);
        } catch (error) {
            res.status(404).json({ error: error.message || 'Producto no encontrado' });
        }
    }

    crearProducto = async (req, res) => {
        try {
            const data = {
                ...req.body,
                // Si viene imagen subida por multer, usar su URL de Cloudinary
                imagen_url: req.file ? req.file.path : req.body.imagen_url
            };
            const nuevo = await this.productoService.crearProducto(data);
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    actualizarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const data = {
                ...req.body,
                // Si viene imagen subida por multer, usar su URL de Cloudinary
                imagen_url: req.file ? req.file.path : req.body.imagen_url
            };
            const actualizado = await this.productoService.actualizarProducto(id, data);
            res.json(actualizado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    eliminarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            await this.productoService.eliminarProducto(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = ProductoController;