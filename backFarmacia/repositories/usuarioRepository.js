class UsuarioRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        const query = 'SELECT * FROM usuario WHERE email = ?';
        const [rows] = await this.db.query(query, [email]);
        return rows[0]; 
    }

    async create(datos) {
        const query = `
            INSERT INTO usuario (nombre, email, password, telefono, direccion, rol) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            datos.nombre, 
            datos.email, 
            datos.password, 
            datos.telefono, 
            datos.direccion, 
            datos.rol || 'cliente'
        ];
        const [result] = await this.db.query(query, params);
        return result.insertId;
    }

    async findAll() {
        const [rows] = await this.db.query('SELECT id, nombre, email, telefono, direccion, rol, created_at FROM usuario');
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query('SELECT id, nombre, email, telefono, direccion, rol, created_at FROM usuario WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async update(id, datos) {
        const fields = [];
        const params = [];

        if (datos.nombre !== undefined) { fields.push('nombre = ?'); params.push(datos.nombre); }
        if (datos.email !== undefined) { fields.push('email = ?'); params.push(datos.email); }
        if (datos.password !== undefined) { fields.push('password = ?'); params.push(datos.password); }
        if (datos.telefono !== undefined) { fields.push('telefono = ?'); params.push(datos.telefono); }
        if (datos.direccion !== undefined) { fields.push('direccion = ?'); params.push(datos.direccion); }
        if (datos.rol !== undefined) { fields.push('rol = ?'); params.push(datos.rol); }

        if (fields.length === 0) return await this.findById(id);

        params.push(id);
        const sql = `UPDATE usuario SET ${fields.join(', ')} WHERE id = ?`;
        await this.db.query(sql, params);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await this.db.query('DELETE FROM usuario WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByRole(role) {
        const [rows] = await this.db.query('SELECT id, nombre, email, telefono, rol FROM usuario WHERE rol = ?', [role]);
        return rows;
    }
}

module.exports = UsuarioRepository;