class NewsletterRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM suscriptor_newsletter WHERE activo = TRUE');
        return rows;
    }

    async findByEmail(email) {
        const [rows] = await this.db.query('SELECT * FROM suscriptor_newsletter WHERE email = ?', [email]);
        return rows[0];
    }

    async create(suscriptor) {
        const { email, nombre } = suscriptor;
        const [result] = await this.db.query(
            'INSERT INTO suscriptor_newsletter (email, nombre) VALUES (?, ?)',
            [email, nombre || null]
        );
        return { id: result.insertId, email, nombre };
    }

    async delete(email) {
        const [result] = await this.db.query('UPDATE suscriptor_newsletter SET activo = FALSE WHERE email = ?', [email]);
        return result.affectedRows > 0;
    }

    async getAllEmails() {
        const [rows] = await this.db.query('SELECT email FROM suscriptor_newsletter WHERE activo = TRUE');
        return rows.map(r => r.email);
    }
}

module.exports = NewsletterRepository;
