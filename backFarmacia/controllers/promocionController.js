class PromocionController {
    constructor(promocionService) {
        this.promocionService = promocionService;
    }

    async obtenerTodas(req, res) {
        try {
            const promociones = await this.promocionService.obtenerTodas();
            res.json(promociones);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerActivas(req, res) {
        try {
            const promociones = await this.promocionService.obtenerActivas();
            res.json(promociones);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const promocion = await this.promocionService.obtenerPorId(req.params.id);
            if (!promocion) {
                return res.status(404).json({ message: 'Promoción no encontrada' });
            }
            res.json(promocion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) {
                // req.file.path contiene la URL de Cloudinary
                data.imagen_url = req.file.path;
            }
            const promocion = await this.promocionService.crear(data);
            res.status(201).json(promocion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) {
                // req.file.path contiene la URL de Cloudinary
                data.imagen_url = req.file.path;
            }
            const promocion = await this.promocionService.actualizar(req.params.id, data);
            res.json(promocion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const eliminado = await this.promocionService.eliminar(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ message: 'Promoción no encontrada' });
            }
            res.json({ message: 'Promoción eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async notificarSuscriptores(req, res) {
        try {
            const resultado = await this.promocionService.notificarSuscriptores(req.params.id);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = PromocionController;
