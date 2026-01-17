class PasswordResetRepository {
    constructor(db) {
        this.db = db;
    }

    async createToken(usuarioId, token, expiracion) {
        const [result] = await this.db.query(
            'INSERT INTO password_reset (usuario_id, token, expiracion, used) VALUES (?, ?, ?, 0)',
            [usuarioId, token, expiracion]
        );
        return result.insertId;
    }

    async findByToken(token) {
        const [rows] = await this.db.query('SELECT * FROM password_reset WHERE token = ?', [token]);
        return rows[0] || null;
    }

    async markUsed(id) {
        await this.db.query('UPDATE password_reset SET used = 1 WHERE id = ?', [id]);
    }

    async deleteById(id) {
        await this.db.query('DELETE FROM password_reset WHERE id = ?', [id]);
    }
}

module.exports = PasswordResetRepository;
