class EstadisticaController {
    constructor(estadisticaService) {
        this.estadisticaService = estadisticaService;
    }

    getDashboardStats = async (req, res) => {
        try {
            const { year, month } = req.query;
            const targetYear = year || new Date().getFullYear();
            const targetMonth = month || (new Date().getMonth() + 1);

            const stats = await this.estadisticaService.getDashboardStats(targetYear, targetMonth);
            res.json(stats);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        }
    }
}

module.exports = EstadisticaController;
