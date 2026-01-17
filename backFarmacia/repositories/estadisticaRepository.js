class EstadisticaRepository {
    constructor(db) {
        this.db = db;
    }

    async getTopClientes() {
        const query = `
            SELECT 
                u.id, 
                u.nombre, 
                u.email, 
                COUNT(p.id) as total_compras, 
                SUM(p.total) as total_gastado
            FROM usuario u
            JOIN pedido p ON u.id = p.usuario_id
            WHERE u.rol = 'cliente' AND p.estado_pago = 'pagado'
            GROUP BY u.id
            ORDER BY total_compras DESC
            LIMIT 10
        `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async getVentasPorPeriodo(year, month) {
        const query = `
            SELECT 
                DAY(fecha) as dia, 
                SUM(total) as total_ventas,
                COUNT(id) as num_pedidos
            FROM pedido
            WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND estado_pago = 'pagado'
            GROUP BY DAY(fecha)
            ORDER BY dia ASC
        `;
        const [rows] = await this.db.query(query, [year, month]);
        return rows;
    }

    async getEstadisticasCanal(year, month) {
        const query = `
            SELECT 
                estado_envio as canal,
                COUNT(id) as cantidad,
                SUM(total) as total
            FROM pedido
            WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND estado_pago = 'pagado'
            GROUP BY estado_envio
        `;
        const [rows] = await this.db.query(query, [year, month]);
        return rows;
    }

    async getKpis(year, month) {
        // Ventas totales del mes
        const [ventasRow] = await this.db.query(
            "SELECT SUM(total) as total FROM pedido WHERE YEAR(fecha) = ? AND MONTH(fecha) = ? AND estado_pago = 'pagado'",
            [year, month]
        );

        // Nuevos usuarios del mes
        const [usuariosRow] = await this.db.query(
            "SELECT COUNT(id) as total FROM usuario WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?",
            [year, month]
        );

        // Pedidos pendientes
        const [pendientesRow] = await this.db.query(
            "SELECT COUNT(id) as total FROM pedido WHERE estado_pago = 'pendiente' OR estado_envio = 'en_tienda'"
        );

        // Stock crítico (menos de 10 unidades)
        const [stockRow] = await this.db.query(
            "SELECT COUNT(id) as total FROM producto WHERE stock < 10"
        );

        return {
            totalVentas: ventasRow[0].total || 0,
            nuevosUsuarios: usuariosRow[0].total || 0,
            pedidosPendientes: pendientesRow[0].total || 0,
            stockCritico: stockRow[0].total || 0
        };
    }

    async getRecentOrders() {
        const query = `
            SELECT p.*, u.nombre as usuario_nombre 
            FROM pedido p 
            LEFT JOIN usuario u ON p.usuario_id = u.id 
            ORDER BY p.fecha DESC 
            LIMIT 5
        `;
        const [rows] = await this.db.query(query);
        return rows;
    }
}

module.exports = EstadisticaRepository;
