class CategoriaService {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    async listarTodos() {
        return await this.categoriaRepository.findAll();
    }

    async obtenerPorId(id) {
        const cat = await this.categoriaRepository.findById(id);
        if (!cat) throw new Error('Categoría no encontrada');
        return cat;
    }

    async crearCategoria(data) {
        return await this.categoriaRepository.create(data);
    }

    async actualizarCategoria(id, data) {
        const cat = await this.categoriaRepository.findById(id);
        if (!cat) throw new Error('Categoría no encontrada');
        return await this.categoriaRepository.update(id, data);
    }

    async eliminarCategoria(id) {
        const cat = await this.categoriaRepository.findById(id);
        if (!cat) throw new Error('Categoría no encontrada');
        const ok = await this.categoriaRepository.delete(id);
        if (!ok) throw new Error('No se pudo eliminar la categoría');
        return true;
    }
}

module.exports = CategoriaService;
