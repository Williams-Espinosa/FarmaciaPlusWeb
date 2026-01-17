class PromocionService {
    constructor(promocionRepository, newsletterRepository, emailService) {
        this.promocionRepository = promocionRepository;
        this.newsletterRepository = newsletterRepository;
        this.emailService = emailService;
    }

    async obtenerTodas() {
        return await this.promocionRepository.findAll();
    }

    async obtenerActivas() {
        return await this.promocionRepository.findActive();
    }

    async obtenerPorId(id) {
        return await this.promocionRepository.findById(id);
    }

    async crear(promocion) {
        const nuevaPromocion = await this.promocionRepository.create(promocion);
        // Si se envió un código de descuento en el payload, crear registro en tabla codigo_descuento
        if (promocion.codigo_descuento) {
            await this.promocionRepository.createCode(nuevaPromocion.id, {
                codigo: promocion.codigo_descuento,
                fecha_expiracion: promocion.fecha_fin
            });
            // Recargar la promoción para incluir el código (campo codigo_descuento)
            return await this.promocionRepository.findById(nuevaPromocion.id);
        }
        return nuevaPromocion;
    }

    async actualizar(id, promocion) {
        const updated = await this.promocionRepository.update(id, promocion);
        // Si se envía un nuevo código al actualizar, crear un nuevo registro de código
        if (promocion.codigo_descuento) {
            await this.promocionRepository.createCode(id, {
                codigo: promocion.codigo_descuento,
                fecha_expiracion: promocion.fecha_fin
            });
            return await this.promocionRepository.findById(id);
        }
        return updated;
    }

    async eliminar(id) {
        return await this.promocionRepository.delete(id);
    }

    // Notificar a todos los suscriptores sobre una nueva promoción
    async notificarSuscriptores(promocionId) {
        const promocion = await this.promocionRepository.findById(promocionId);
        if (!promocion) {
            throw new Error('Promoción no encontrada');
        }

        const suscriptores = await this.newsletterRepository.findAll();
        
        if (suscriptores.length === 0) {
            return { success: true, message: 'No hay suscriptores para notificar', notificados: 0 };
        }

        let notificados = 0;
        const errores = [];

        for (const suscriptor of suscriptores) {
            try {
                await this.emailService.enviarNotificacionPromocion(suscriptor.email, promocion);
                notificados++;
            } catch (error) {
                errores.push({ email: suscriptor.email, error: error.message });
            }
        }

        // Marcar como notificada
        await this.promocionRepository.markAsNotified(promocionId);

        return { 
            success: true, 
            message: `Notificación enviada a ${notificados} suscriptores`,
            notificados,
            errores: errores.length > 0 ? errores : undefined
        };
    }
}

module.exports = PromocionService;
