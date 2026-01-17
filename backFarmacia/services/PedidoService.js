class PedidoService {
    constructor(pedidoRepo, productoRepo, pagoOxxoRepo, emailService, oxxoService) {
        this.pedidoRepo = pedidoRepo;
        this.productoRepo = productoRepo;
        this.pagoOxxoRepo = pagoOxxoRepo;
        this.emailService = emailService;
        this.oxxoService = oxxoService;
    }

    async procesarVenta(datos) {
        // ... (existing logic)
        const connection = await this.pedidoRepo.startTransaction();

        try {
            // 1. Apartar stock (Lógica de stock pendiente)
            for (const item of datos.productos) {
                const exitoStock = await this.productoRepo.reserveStock(item.id, item.cantidad, connection);
                if (!exitoStock) throw new Error(`No hay suficiente stock del producto ${item.id}`);
            }

            // 2. Crear el registro del pedido
            const pedidoId = await this.pedidoRepo.create(datos, connection);
            await this.pedidoRepo.saveDetalle(pedidoId, datos.productos, connection);

            let respuesta = { pedidoId };

            // 3. Si eligió Oxxo, generar ficha
            if (datos.metodo_pago === 'oxxo') {
                const ficha = await this.oxxoService.generarReferencia({ id: pedidoId, total: datos.total });
                respuesta.ficha = ficha;
            }

            // 4. Confirmar todo en la DB
            await connection.commit();

            // 5. Enviar correo (Fuera de la transacción para no bloquear)
            this.emailService.enviarConfirmacionPedido(datos.usuarioEmail, pedidoId);

            return respuesta;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async procesarVentaMostrador(datos) {
        const connection = await this.pedidoRepo.startTransaction();
        try {
            // 1. Apartar stock
            for (const item of datos.productos) {
                const exitoStock = await this.productoRepo.reserveStock(item.id, item.cantidad, connection);
                if (!exitoStock) throw new Error(`No hay suficiente stock del producto ${item.id}`);
            }

            // 2. Crear pedido
            const pedidoId = await this.pedidoRepo.create(datos, connection);
            await this.pedidoRepo.saveDetalle(pedidoId, datos.productos, connection);

            await connection.commit();

            // Intentar enviar correo pero no fallar si error
            try {
                if (datos.usuarioEmail) {
                    await this.emailService.enviarConfirmacionPedido(datos.usuarioEmail, pedidoId);
                }
            } catch (emailError) {
                console.warn('No se pudo enviar correo de confirmación (Venta Mostrador):', emailError.message);
            }

            return { pedidoId, message: 'Venta registrada correctamente' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarTodos() {
        return await this.pedidoRepo.findAll();
    }

    async listarPorUsuario(usuarioId) {
        return await this.pedidoRepo.findByUsuario(usuarioId);
    }

    async obtenerPorId(id) {
        const pedido = await this.pedidoRepo.findById(id);
        if (!pedido) throw new Error('Pedido no encontrado');
        return pedido;
    }

    async cancelarPedido(id, requesterId, requesterRol) {
        // Permisos: admin (rol 1) o propietario
        const pedido = await this.pedidoRepo.findById(id);
        if (!pedido) throw new Error('Pedido no encontrado');
        if (requesterRol !== 1 && pedido.usuario_id !== requesterId) {
            const err = new Error('No tienes permisos para cancelar este pedido');
            err.status = 403;
            throw err;
        }

        const connection = await this.pedidoRepo.startTransaction();
        try {
            await this.pedidoRepo.cancelarPedido(id, connection);
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async actualizarPedido(id, data, requesterRol) {
        // Método básico para permitir ajustes por admin (p.ej. cambiar metodo_pago o estado_pago)
        if (requesterRol !== 1) {
            const err = new Error('No tienes permisos para actualizar este pedido');
            err.status = 403;
            throw err;
        }

        const allowed = ['metodo_pago', 'estado_pago', 'estado_envio', 'total'];
        const updates = [];
        const params = [];
        for (const key of allowed) {
            if (key in data) {
                updates.push(`${key} = ?`);
                params.push(data[key]);
            }
        }
        if (updates.length === 0) throw new Error('No hay campos válidos para actualizar');
        params.push(id);
        const sql = `UPDATE pedido SET ${updates.join(', ')} WHERE id = ?`;
        await this.pedidoRepo.db.query(sql, params);
        return await this.obtenerPorId(id);
    }

    async listarProductosRecientes(usuarioId) {
        return await this.pedidoRepo.findProductosRecientesByUsuario(usuarioId);
    }

    async cambiarEstatusEnvio(id, nuevoEstatus) {
        const allowed = ['pendiente', 'en_transito', 'entregado', 'cancelado'];
        if (!allowed.includes(nuevoEstatus)) {
            throw new Error('Estatus de envío no válido');
        }

        const pedido = await this.pedidoRepo.findById(id);
        if (!pedido) throw new Error('Pedido no encontrado');

        const sql = `UPDATE pedido SET estado_envio = ? WHERE id = ?`;
        await this.pedidoRepo.db.query(sql, [nuevoEstatus, id]);

        // Si se cancela, restaurar stock
        if (nuevoEstatus === 'cancelado' && pedido.estado_envio !== 'cancelado') {
            const connection = await this.pedidoRepo.startTransaction();
            try {
                await this.pedidoRepo.cancelarPedido(id, connection);
                await connection.commit();
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        }

        return true;
    }
}

module.exports = PedidoService;