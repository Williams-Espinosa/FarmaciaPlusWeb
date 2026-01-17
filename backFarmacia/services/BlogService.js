class BlogService {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

    async listarTodos() {
        return await this.blogRepository.findAll();
    }

    async listarDestacados(limit = 5) {
        return await this.blogRepository.findFeatured(limit);
    }

    async obtenerPorId(id) {
        const post = await this.blogRepository.findById(id);
        if (!post) throw new Error('Post no encontrado');
        return post;
    }

    async crearPost(data) {
        // Aquí se podrían añadir validaciones adicionales
        return await this.blogRepository.create(data);
    }

    async actualizarPost(id, data) {
        const post = await this.blogRepository.findById(id);
        if (!post) throw new Error('Post no encontrado');
        return await this.blogRepository.update(id, data);
    }

    async eliminarPost(id) {
        const post = await this.blogRepository.findById(id);
        if (!post) throw new Error('Post no encontrado');
        const ok = await this.blogRepository.delete(id);
        if (!ok) throw new Error('No se pudo eliminar el post');
        return true;
    }
}

module.exports = BlogService;
