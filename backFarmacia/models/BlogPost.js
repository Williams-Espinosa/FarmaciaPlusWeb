class BlogPost {
    constructor({ id, titulo, descripcion, imagen_url, destacado, created_at }) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.imagen_url = imagen_url;
        this.destacado = !!destacado;
        this.created_at = created_at;
    }
}

module.exports = BlogPost;
