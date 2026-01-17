class PromocionRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.query(`
            SELECT p.*, 
                   (SELECT cd.codigo FROM codigo_descuento cd WHERE cd.promocion_id = p.id ORDER BY cd.id DESC LIMIT 1) AS codigo_descuento,
                   prod.nombre AS producto_nombre, prod.precio AS producto_precio, 
                   prod.stock AS producto_stock, prod.imagen_url AS producto_imagen,
                   c.nombre AS categoria_nombre
            FROM promocion p
            LEFT JOIN producto prod ON p.producto_id = prod.id
            LEFT JOIN categoria c ON p.categoria_id = c.id
            ORDER BY p.created_at DESC
        `);
        return rows;
    }

    async findActive() {
        const [rows] = await this.db.query(`
            SELECT p.*, 
                   (SELECT cd.codigo FROM codigo_descuento cd WHERE cd.promocion_id = p.id ORDER BY cd.id DESC LIMIT 1) AS codigo_descuento,
                   prod.nombre AS producto_nombre, prod.precio AS producto_precio, 
                   prod.stock AS producto_stock, prod.imagen_url AS producto_imagen,
                   c.nombre AS categoria_nombre
            FROM promocion p
            LEFT JOIN producto prod ON p.producto_id = prod.id
            LEFT JOIN categoria c ON p.categoria_id = c.id
            WHERE p.activo = TRUE 
            AND p.fecha_inicio <= CURDATE() 
            AND p.fecha_fin >= CURDATE()
            ORDER BY p.created_at DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query(`
            SELECT p.*, 
                (SELECT cd.codigo FROM codigo_descuento cd WHERE cd.promocion_id = p.id ORDER BY cd.id DESC LIMIT 1) AS codigo_descuento,
                prod.nombre AS producto_nombre, prod.precio AS producto_precio, 
                prod.stock AS producto_stock, prod.imagen_url AS producto_imagen,
                c.nombre AS categoria_nombre
            FROM promocion p
            LEFT JOIN producto prod ON p.producto_id = prod.id
            LEFT JOIN categoria c ON p.categoria_id = c.id
            WHERE p.id = ?
        `, [id]);
        const promocion = rows[0];
        if (!promocion) return null;
        // Añadir array de códigos asociados
        const codigos = await this.getCodes(promocion.id);
        promocion.codigos = codigos;
        // Mantener compatibilidad con front: campo codigo_descuento (último código creado)
        if (!promocion.codigo_descuento && codigos.length) {
            promocion.codigo_descuento = codigos[0].codigo;
        }
        return promocion;
    }

    async create(promocion) {
        const { titulo, descripcion, tipo, descuento, producto_id, categoria_id, fecha_inicio, fecha_fin, imagen_url } = promocion;
        const [result] = await this.db.query(
            `INSERT INTO promocion (titulo, descripcion, tipo, descuento, producto_id, categoria_id, fecha_inicio, fecha_fin, imagen_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, tipo, descuento, producto_id || null, categoria_id || null, fecha_inicio, fecha_fin, imagen_url || null]
        );
        return await this.findById(result.insertId);
    }

    async update(id, promocion) {
        const fields = [];
        const params = [];
        
        const possibleFields = [
            'titulo', 'descripcion', 'tipo', 'descuento', 
            'producto_id', 'categoria_id', 'fecha_inicio', 
            'fecha_fin', 'activo', 'imagen_url'
        ];

        possibleFields.forEach(field => {
            if (promocion[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(promocion[field]);
            }
        });

        if (fields.length === 0) return await this.findById(id);

        params.push(id);
        const sql = `UPDATE promocion SET ${fields.join(', ')} WHERE id = ?`;
        await this.db.query(sql, params);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await this.db.query('DELETE FROM promocion WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async markAsNotified(id) {
        await this.db.query('UPDATE promocion SET notificado = TRUE WHERE id = ?', [id]);
    }

    // Códigos de descuento relacionados con la promoción (tabla codigo_descuento)
    async getCodes(promocionId) {
        const [rows] = await this.db.query('SELECT * FROM codigo_descuento WHERE promocion_id = ?', [promocionId]);
        return rows;
    }

    async createCode(promocionId, code) {
        const { codigo, limite_uso = null, fecha_expiracion } = code;
        const [result] = await this.db.query(
            `INSERT INTO codigo_descuento (codigo, promocion_id, limite_uso, fecha_expiracion) VALUES (?, ?, ?, ?)`,
            [codigo, promocionId, limite_uso, fecha_expiracion]
        );
        const [rows] = await this.db.query('SELECT * FROM codigo_descuento WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    async deleteCode(codeId) {
        const [result] = await this.db.query('DELETE FROM codigo_descuento WHERE id = ?', [codeId]);
        return result.affectedRows > 0;
    }
}

module.exports = PromocionRepository;
