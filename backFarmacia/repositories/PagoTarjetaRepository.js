class PagoTarjetaRepository {
    constructor(db) {
        this.db = db;
    }

    async crear(datosPago) {
        try {
            const sql = `
                INSERT INTO pago_tarjeta 
                (pedido_id, stripe_payment_intent_id, stripe_charge_id, ultimos_4_digitos, marca, estado, monto) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await this.db.query(sql, [
                datosPago.pedido_id,
                datosPago.stripe_payment_intent_id,
                datosPago.stripe_charge_id || null,
                datosPago.ultimos_4_digitos || null,
                datosPago.marca || 'otro',
                datosPago.estado || 'pendiente',
                datosPago.monto
            ]);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear pago tarjeta:', error);
            throw error;
        }
    }

    async actualizarEstado(paymentIntentId, nuevoEstado, chargeId = null, last4 = null, brand = null) {
        try {
            const updates = ['estado = ?'];
            const params = [nuevoEstado];

            if (chargeId) {
                updates.push('stripe_charge_id = ?');
                params.push(chargeId);
            }
            if (last4) {
                updates.push('ultimos_4_digitos = ?');
                params.push(last4);
            }
            if (brand) {
                updates.push('marca = ?');
                params.push(brand);
            }

            params.push(paymentIntentId);

            const sql = `UPDATE pago_tarjeta SET ${updates.join(', ')} WHERE stripe_payment_intent_id = ?`;
            await this.db.query(sql, params);
        } catch (error) {
            console.error('Error al actualizar pago tarjeta:', error);
            throw error;
        }
    }

    async buscarPorPaymentIntent(paymentIntentId) {
        try {
            const sql = 'SELECT * FROM pago_tarjeta WHERE stripe_payment_intent_id = ?';
            const [rows] = await this.db.query(sql, [paymentIntentId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar pago tarjeta:', error);
            throw error;
        }
    }

    async buscarPorPedido(pedidoId) {
        try {
            const sql = 'SELECT * FROM pago_tarjeta WHERE pedido_id = ?';
            const [rows] = await this.db.query(sql, [pedidoId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error al buscar pago tarjeta por pedido:', error);
            throw error;
        }
    }
}

module.exports = PagoTarjetaRepository;
