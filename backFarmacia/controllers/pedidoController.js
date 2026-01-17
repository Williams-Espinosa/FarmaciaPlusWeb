class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }

    crearPedido = async (req, res) => {
        try {
            let productosData = req.body.productos;
            if (typeof productosData === 'string') {
                productosData = JSON.parse(productosData);
            }

            let usuarioId = req.usuarioId;
            let usuarioEmail = req.correo;

            const datosPedido = {
                usuarioId: usuarioId, 
                usuarioEmail: usuarioEmail,
                productos: productosData,
                metodo_pago: req.body.metodo_pago,
                total: req.body.total,
                receta_path: req.file ? req.file.path : null 
            };

            const resultado = await this.pedidoService.procesarVenta(datosPedido);
            
            res.status(201).json(resultado);
        } catch (error) {
            console.error("Error en PedidoController:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    crearVentaMostrador = async (req, res) => {
        try {
            let productosData = req.body.productos;
            if (typeof productosData === 'string') {
                productosData = JSON.parse(productosData);
            }

            // Datos directos del POS
            const datosPedido = {
                usuarioId: req.body.usuarioId || req.usuarioId, // Usa el enviado o el del empleado
                usuarioEmail: req.body.usuarioEmail,            // Email del cliente (opcional)
                productos: productosData,
                metodo_pago: req.body.metodo_pago,
                total: req.body.total,
                receta_path: null // Venta mostrador no suele subir receta por aquí, pero podría ajustarse
            };

            const resultado = await this.pedidoService.procesarVentaMostrador(datosPedido);
            res.status(201).json(resultado);
        } catch (error) {
            console.error("Error en Venta Mostrador:", error.message);
            res.status(400).json({ error: error.message });
        }
    }

    actualizarEstatusEnvio = async (req, res) => {
        try {
            const { id } = req.params;
            const { nuevoEstatus } = req.body;
            await this.pedidoService.cambiarEstatusEnvio(id, nuevoEstatus);
            res.json({ message: "Estatus de envío actualizado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    listarTodos = async (req, res) => {
        try {
            const pedidos = await this.pedidoService.listarTodos();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    listarPorUsuario = async (req, res) => {
        try {
            const pedidos = await this.pedidoService.listarPorUsuario(req.usuarioId);
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const pedido = await this.pedidoService.obtenerPorId(id);

            // Verificar permisos: admin o propietario
            if (req.rol !== 1 && pedido.usuario_id !== req.usuarioId) {
                return res.status(403).json({ error: 'No tienes permisos para ver este pedido' });
            }

            res.json(pedido);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    cancelarPedido = async (req, res) => {
        try {
            const { id } = req.params;
            await this.pedidoService.cancelarPedido(id, req.usuarioId, req.rol);
            res.json({ message: 'Pedido cancelado' });
        } catch (error) {
            const status = error.status || 400;
            res.status(status).json({ error: error.message });
        }
    }

    actualizarPedido = async (req, res) => {
        try {
            const { id } = req.params;
            const actualizado = await this.pedidoService.actualizarPedido(id, req.body, req.rol);
            res.json(actualizado);
        } catch (error) {
            const status = error.status || 400;
            res.status(status).json({ error: error.message });
        }
    }

    listarProductosRecientes = async (req, res) => {
        try {
            const productos = await this.pedidoService.listarProductosRecientes(req.usuarioId);
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PedidoController;