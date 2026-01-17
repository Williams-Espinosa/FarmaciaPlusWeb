class PagoController {
    constructor(stripeService, pedidoRepo, pagoTarjetaRepo, pagoOxxoRepo) {
        this.stripeService = stripeService;
        this.pedidoRepo = pedidoRepo;
        this.pagoTarjetaRepo = pagoTarjetaRepo;
        this.pagoOxxoRepo = pagoOxxoRepo;
    }

    /**
     * Crear intención de pago (Payment Intent)
     */
    crearPaymentIntent = async (req, res) => {
        try {
            const { monto, metodoPago, pedidoId, customerEmail } = req.body;

            if (!monto || !metodoPago || !customerEmail) {
                return res.status(400).json({ 
                    error: 'Faltan datos requeridos: monto, metodoPago, customerEmail' 
                });
            }

            const resultado = await this.stripeService.crearPaymentIntent(
                monto,
                metodoPago,
                customerEmail,
                { pedido_id: pedidoId }
            );

            res.json(resultado);
        } catch (error) {
            console.error('Error al crear payment intent:', error);
            res.status(500).json({ error: error.message });
        }
    };

    /**
     * Webhook de Stripe para confirmar pagos
     */
    webhookStripe = async (req, res) => {
        const sig = req.headers['stripe-signature'];

        try {
            // Verificar firma del webhook
            const event = this.stripeService.verificarWebhookSignature(
                req.body,
                sig
            );

            console.log(`Webhook recibido: ${event.type}`);

            // Manejar diferentes tipos de eventos
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                case 'payment_intent.canceled':
                    await this.handlePaymentCanceled(event.data.object);
                    break;

                default:
                    console.log(`Evento no manejado: ${event.type}`);
            }

            res.json({ received: true });
        } catch (error) {
            console.error('Error en webhook:', error);
            res.status(400).json({ error: `Webhook error: ${error.message}` });
        }
    };

    /**
     * Manejar pago exitoso
     */
    async handlePaymentSuccess(paymentIntent) {
        try {
            const pedidoId = paymentIntent.metadata.pedido_id;
            const chargeId = paymentIntent.charges?.data[0]?.id;

            // Actualizar estado del pedido a "pagado"
            await this.pedidoRepo.db.query(
                'UPDATE pedido SET estado_pago = ?, transaction_id = ? WHERE id = ?',
                ['pagado', paymentIntent.id, pedidoId]
            );

            // Actualizar registro de pago según el tipo
            if (paymentIntent.payment_method_types.includes('card')) {
                // Pago con tarjeta
                const charge = await this.stripeService.obtenerCharge(chargeId);
                await this.pagoTarjetaRepo.actualizarEstado(
                    paymentIntent.id,
                    'exitoso',
                    chargeId,
                    charge.last4,
                    charge.brand
                );
            } else if (paymentIntent.payment_method_types.includes('oxxo')) {
                // Pago con OXXO
                await this.pagoOxxoRepo.actualizarEstado(
                    paymentIntent.id,
                    'pagado',
                    chargeId
                );
            }

            console.log(`Pago exitoso para pedido ${pedidoId}`);
        } catch (error) {
            console.error('Error al procesar pago exitoso:', error);
        }
    }

    /**
     * Manejar pago fallido
     */
    async handlePaymentFailed(paymentIntent) {
        try {
            const pedidoId = paymentIntent.metadata.pedido_id;

            await this.pedidoRepo.db.query(
                'UPDATE pedido SET estado_pago = ? WHERE id = ?',
                ['cancelado', pedidoId]
            );

            console.log(`Pago fallido para pedido ${pedidoId}`);
        } catch (error) {
            console.error('Error al procesar pago fallido:', error);
        }
    }

    /**
     * Manejar pago cancelado
     */
    async handlePaymentCanceled(paymentIntent) {
        try {
            const pedidoId = paymentIntent.metadata.pedido_id;

            await this.pedidoRepo.db.query(
                'UPDATE pedido SET estado_pago = ? WHERE id = ?',
                ['cancelado', pedidoId]
            );

            console.log(`Pago cancelado para pedido ${pedidoId}`);
        } catch (error) {
            console.error('Error al procesar pago cancelado:', error);
        }
    }

    /**
     * Consultar estado de pago
     */
    consultarEstadoPago = async (req, res) => {
        try {
            const { pedidoId } = req.params;

            const pedido = await this.pedidoRepo.findById(pedidoId);
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            let detallePago = null;

            if (pedido.metodo_pago === 'tarjeta') {
                detallePago = await this.pagoTarjetaRepo.buscarPorPedido(pedidoId);
            } else if (pedido.metodo_pago === 'oxxo') {
                detallePago = await this.pagoOxxoRepo.buscarPorPedido(pedidoId);
            }

            res.json({
                pedidoId: pedido.id,
                estadoPago: pedido.estado_pago,
                metodoPago: pedido.metodo_pago,
                total: pedido.total,
                detallePago: detallePago
            });
        } catch (error) {
            console.error('Error al consultar estado de pago:', error);
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = PagoController;
