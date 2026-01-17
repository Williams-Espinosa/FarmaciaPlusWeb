class CategoriaRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM categoria ORDER BY nombre');
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query('SELECT * FROM categoria WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async create(categoria) {
        const { nombre, descripcion } = categoria;
        const [result] = await this.db.query('INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        return await this.findById(result.insertId);
    }

    async update(id, categoria) {
        const fields = [];
        const params = [];
        if (categoria.nombre !== undefined) { fields.push('nombre = ?'); params.push(categoria.nombre); }
        if (categoria.descripcion !== undefined) { fields.push('descripcion = ?'); params.push(categoria.descripcion); }
        if (fields.length === 0) return await this.findById(id);
        params.push(id);
        const sql = `UPDATE categoria SET ${fields.join(', ')} WHERE id = ?`;
        await this.db.query(sql, params);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await this.db.query('DELETE FROM categoria WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = CategoriaRepository;
