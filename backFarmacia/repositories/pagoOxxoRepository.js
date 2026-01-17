class PagoOxxoRepository {
    constructor(db) {
        this.db = db;
    }

    async saveReference(pedidoId, referencia, monto, expiracion, paymentIntentId = null) {
        try {
            const sql = `
                INSERT INTO pago_externo 
                (pedido_id, tipo_pago, referencia, monto, expiracion, stripe_payment_intent_id, estado) 
                VALUES (?, 'oxxo', ?, ?, ?, ?, 'pendiente')
            `;
            const [result] = await this.db.query(sql, [
                pedidoId,
                referencia,
                monto,
                expiracion,
                paymentIntentId
            ]);
            return result.insertId;
        } catch (error) {
            console.error('Error al guardar referencia OXXO:', error);
            throw error;
        }
    }

    async actualizarEstado(paymentIntentId, nuevoEstado, chargeId = null) {
        try {
            let sql = 'UPDATE pago_externo SET estado = ?';
            const params = [nuevoEstado];

            if (chargeId) {
                sql += ', stripe_charge_id = ?';
                params.push(chargeId);
            }

            sql += ' WHERE stripe_payment_intent_id = ?';
            params.push(paymentIntentId);

            await this.db.query(sql, params);
        } catch (error) {
            console.error('Error al actualizar estado OXXO:', error);
            throw error;
        }
    }

    async buscarPorPaymentIntent(paymentIntentId) {
        try {
            const sql = 'SELECT * FROM pago_externo WHERE stripe_payment_intent_id = ?';
            const [rows] = await this.db.query(sql, [paymentIntentId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar pago OXXO:', error);
            throw error;
        }
    }

    async buscarPorPedido(pedidoId) {
        try {
            const sql = 'SELECT * FROM pago_externo WHERE pedido_id = ?';
            const [rows] = await this.db.query(sql, [pedidoId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar pago OXXO por pedido:', error);
            throw error;
        }
    }
}

module.exports = PagoOxxoRepository;