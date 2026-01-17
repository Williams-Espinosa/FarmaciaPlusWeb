class Producto {
    constructor({ id, nombre, descripcion, precio, stock, codigo_barras, requiere_receta, imagen_url, categoria_id, categoria_nombre }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.codigo_barras = codigo_barras; 
        this.requiere_receta = requiere_receta;
        this.imagen_url = imagen_url;
        this.categoria_id = categoria_id;
        this.categoria_nombre = categoria_nombre || null;
    }
}

module.exports = Producto;