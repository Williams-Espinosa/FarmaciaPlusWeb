class ProductoRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.query(
            `SELECT p.*, c.id AS categoria_id, c.nombre AS categoria_nombre
             FROM producto p
             LEFT JOIN categoria c ON p.categoria_id = c.id`
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query(
            `SELECT p.*, c.id AS categoria_id, c.nombre AS categoria_nombre
             FROM producto p
             LEFT JOIN categoria c ON p.categoria_id = c.id
             WHERE p.id = ?`, [id]
        );
        return rows[0];
    }

    async findByBarcode(codigo) {
        const [rows] = await this.db.query(
            `SELECT p.*, c.id AS categoria_id, c.nombre AS categoria_nombre
             FROM producto p
             LEFT JOIN categoria c ON p.categoria_id = c.id
             WHERE p.codigo_barras = ?`, [codigo]
        );
        return rows[0];
    }

    async create(producto) {
        const { nombre, descripcion, precio, stock, codigo_barras, requiere_receta, imagen_url, categoria_id } = producto;
        const [result] = await this.db.query(
            'INSERT INTO producto (nombre, descripcion, precio, stock, codigo_barras, requiere_receta, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, codigo_barras || null, (requiere_receta == 1 || requiere_receta === true) ? 1 : 0, imagen_url, categoria_id || null]
        );
        return await this.findById(result.insertId);
    }

    async update(id, producto) {
        const { nombre, descripcion, precio, stock, codigo_barras, requiere_receta, imagen_url, categoria_id } = producto;
        await this.db.query(
            'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, codigo_barras = ?, requiere_receta = ?, imagen_url = ?, categoria_id = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, codigo_barras || null, (requiere_receta == 1 || requiere_receta === true) ? 1 : 0, imagen_url, categoria_id || null, id]
        );
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await this.db.query('DELETE FROM producto WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async reserveStock(productoId, cantidad, connection) {
        const [result] = await connection.query(
            'UPDATE producto SET stock = stock - ? WHERE id = ? AND stock >= ?',
            [cantidad, productoId, cantidad]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = ProductoRepository;