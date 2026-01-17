class EstadisticaService {
    constructor(estadisticaRepository) {
        this.estadisticaRepository = estadisticaRepository;
    }

    async getDashboardStats(year, month) {
        const [topClientes, ventasMensuales, canalStats, kpis, recentOrders] = await Promise.all([
            this.estadisticaRepository.getTopClientes(),
            this.estadisticaRepository.getVentasPorPeriodo(year, month),
            this.estadisticaRepository.getEstadisticasCanal(year, month),
            this.estadisticaRepository.getKpis(year, month),
            this.estadisticaRepository.getRecentOrders()
        ]);

        return {
            topClientes,
            ventasMensuales,
            canalStats,
            kpis,
            recentOrders
        };
    }
}

module.exports = EstadisticaService;
