class ProductoService {
    constructor(productoRepository, categoriaRepository) {
        if (!productoRepository) console.error("FATAL: ProductoRepository is undefined in ProductoService");
        if (!categoriaRepository) console.error("FATAL: CategoriaRepository is undefined in ProductoService");
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    async buscarPorCodigo(codigo) {
        const producto = await this.productoRepository.findByBarcode(codigo);
        if (!producto) throw new Error("Producto no encontrado");
        return producto;
    }

    async listarCatalogo() {
        return await this.productoRepository.findAll();
    }

    async buscarPorId(id) {
        const producto = await this.productoRepository.findById(id);
        if (!producto) throw new Error('Producto no encontrado');
        return producto;
    }

    async crearProducto(data) {
        // Validar categoría si viene y el repo existe
        if (data.categoria_id && data.categoria_id !== "" && data.categoria_id !== "null") {
            if (!this.categoriaRepository) {
                throw new Error('Error interno: El sistema de categorías no está inicializado.');
            }
            const cat = await this.categoriaRepository.findById(data.categoria_id);
            if (!cat) throw new Error('La categoría seleccionada no existe.');
        }
        return await this.productoRepository.create(data);
    }

    async actualizarProducto(id, data) {
        const producto = await this.productoRepository.findById(id);
        if (!producto) throw new Error('Producto no encontrado');

        if (data.categoria_id) {
            const cat = await this.categoriaRepository.findById(data.categoria_id);
            if (!cat) throw new Error('Categoría no encontrada');
        }

        return await this.productoRepository.update(id, data);
    }

    async eliminarProducto(id) {
        const producto = await this.productoRepository.findById(id);
        if (!producto) throw new Error('Producto no encontrado');
        const success = await this.productoRepository.delete(id);
        if (!success) throw new Error('No se pudo eliminar el producto');
        return true;
    }
}

module.exports = ProductoService;