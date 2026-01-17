class PedidoRepository {
    constructor(db) {
        this.db = db;
    }

    async startTransaction() {
        const connection = await this.db.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async create(datosPedido, connection) {
        const query = `
            INSERT INTO pedido (usuario_id, total, metodo_pago, estado_pago, receta_path)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            datosPedido.usuarioId,
            datosPedido.total,
            datosPedido.metodo_pago,
            datosPedido.metodo_pago === 'oxxo' ? 'pendiente' : 'pagado',
            datosPedido.receta_path
        ];

        const [result] = await connection.query(query, params);
        return result.insertId;
    }

    async saveDetalle(pedidoId, productos, connection) {
        const query = `
            INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario)
            VALUES ?
        `;
        
        const values = productos.map(p => [pedidoId, p.id, p.cantidad, p.precio]);
        await connection.query(query, [values]);
    }

    async updateEstadoPago(pedidoId, nuevoEstado) {
        await this.db.query('UPDATE pedido SET estado_pago = ? WHERE id = ?', [nuevoEstado, pedidoId]);
    }

    async findByUsuario(usuarioId) {
        const query = `
            SELECT p.*, po.referencia, po.expiracion 
            FROM pedido p 
            LEFT JOIN pago_oxxo po ON p.id = po.pedido_id 
            WHERE p.usuario_id = ? 
            ORDER BY p.fecha DESC
        `;
        const [rows] = await this.db.query(query, [usuarioId]);
        return rows;
    }

    async findAll() {
        const query = `
            SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email
            FROM pedido p
            LEFT JOIN usuario u ON p.usuario_id = u.id
            ORDER BY p.fecha DESC
        `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query('SELECT * FROM pedido WHERE id = ?', [id]);
        if (!rows[0]) return null;
        const pedido = rows[0];
        const [detalles] = await this.db.query(
            `SELECT dp.*, pr.nombre, pr.imagen_url FROM detalle_pedidos dp LEFT JOIN producto pr ON dp.producto_id = pr.id WHERE dp.pedido_id = ?`,
            [id]
        );
        pedido.detalles = detalles;
        return pedido;
    }

    async findDetallesByPedido(pedidoId) {
        const [rows] = await this.db.query('SELECT * FROM detalle_pedidos WHERE pedido_id = ?', [pedidoId]);
        return rows;
    }

    // Marca el pedido como cancelado y restaura el stock usando la conexión (transacción)
    async cancelarPedido(pedidoId, connection) {
        // Obtener detalles
        const [detalles] = await connection.query('SELECT producto_id, cantidad FROM detalle_pedidos WHERE pedido_id = ?', [pedidoId]);

        // Restaurar stock
        for (const d of detalles) {
            await connection.query('UPDATE producto SET stock = stock + ? WHERE id = ?', [d.cantidad, d.producto_id]);
        }

        // Marcar pedido como cancelado
        await connection.query('UPDATE pedido SET estado_pago = ? WHERE id = ?', ['cancelado', pedidoId]);
        return true;
    }

    async findProductosRecientesByUsuario(usuarioId) {
        const query = `
            SELECT pr.* 
            FROM producto pr
            JOIN (
                SELECT dp.producto_id, MAX(p.fecha) as ultima_compra
                FROM detalle_pedidos dp
                JOIN pedido p ON dp.pedido_id = p.id
                WHERE p.usuario_id = ?
                GROUP BY dp.producto_id
            ) as compras_recientes ON pr.id = compras_recientes.producto_id
            ORDER BY compras_recientes.ultima_compra DESC
            LIMIT 10
        `;
        const [rows] = await this.db.query(query, [usuarioId]);
        return rows;
    }
}

module.exports = PedidoRepository;