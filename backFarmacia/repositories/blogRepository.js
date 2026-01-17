class BlogRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM blog_post ORDER BY created_at DESC');
        return rows;
    }

    async findFeatured(limit = 5) {
        const [rows] = await this.db.query('SELECT * FROM blog_post WHERE destacado = 1 ORDER BY created_at DESC LIMIT ?', [limit]);
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query('SELECT * FROM blog_post WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async create(post) {
        const { titulo, descripcion, imagen_url, destacado } = post;
        const [result] = await this.db.query(
            'INSERT INTO blog_post (titulo, descripcion, imagen_url, destacado) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, imagen_url || null, destacado ? 1 : 0]
        );
        return await this.findById(result.insertId);
    }

    async update(id, post) {
        const fields = [];
        const params = [];

        if (post.titulo !== undefined) { fields.push('titulo = ?'); params.push(post.titulo); }
        if (post.descripcion !== undefined) { fields.push('descripcion = ?'); params.push(post.descripcion); }
        if (post.imagen_url !== undefined) { fields.push('imagen_url = ?'); params.push(post.imagen_url); }
        if (post.destacado !== undefined) { fields.push('destacado = ?'); params.push(post.destacado ? 1 : 0); }

        if (fields.length === 0) return await this.findById(id);

        params.push(id);
        const sql = `UPDATE blog_post SET ${fields.join(', ')} WHERE id = ?`;
        await this.db.query(sql, params);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await this.db.query('DELETE FROM blog_post WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = BlogRepository;
