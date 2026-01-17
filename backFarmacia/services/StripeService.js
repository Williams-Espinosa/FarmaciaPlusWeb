const stripe = require('../configs/stripeConfig');

class StripeService {
    /**
     * Crear Payment Intent para tarjeta o OXXO
     * @param {Number} monto - Monto en pesos MXN
     * @param {String} metodoPago - 'tarjeta' o 'oxxo'
     * @param {String} customerEmail - Email del cliente
     * @param {Object} metadata - Información adicional (pedidoId, etc.)
     */
    async crearPaymentIntent(monto, metodoPago, customerEmail, metadata = {}) {
        try {
            // Stripe maneja montos en centavos
            const montoCentavos = Math.round(monto * 100);

            const paymentMethodTypes = metodoPago === 'oxxo' ? ['oxxo'] : ['card'];

            const paymentIntent = await stripe.paymentIntents.create({
                amount: montoCentavos,
                currency: 'mxn',
                payment_method_types: paymentMethodTypes,
                receipt_email: customerEmail,
                metadata: metadata,
                // Para OXXO, configurar expiración (3 días)
                ...(metodoPago === 'oxxo' && {
                    payment_method_options: {
                        oxxo: {
                            expires_after_days: 3
                        }
                    }
                })
            });

            return {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status,
                // Para OXXO, incluir detalles de visualización
                ...(metodoPago === 'oxxo' && paymentIntent.next_action && {
                    oxxoDetails: {
                        hostedVoucherUrl: paymentIntent.next_action.oxxo_display_details?.hosted_voucher_url,
                        number: paymentIntent.next_action.oxxo_display_details?.number,
                        expiresAfter: paymentIntent.next_action.oxxo_display_details?.expires_after
                    }
                })
            };
        } catch (error) {
            console.error('Error al crear Payment Intent:', error);
            throw new Error(`Error en Stripe: ${error.message}`);
        }
    }

    /**
     * Confirmar estado de un pago
     */
    async confirmarPago(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100, // Convertir de centavos a pesos
                chargeId: paymentIntent.charges?.data[0]?.id || null,
                paymentMethod: paymentIntent.payment_method_types[0]
            };
        } catch (error) {
            console.error('Error al confirmar pago:', error);
            throw new Error(`Error en Stripe: ${error.message}`);
        }
    }

    /**
     * Cancelar un pago pendiente
     */
    async cancelarPago(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
            return {
                id: paymentIntent.id,
                status: paymentIntent.status
            };
        } catch (error) {
            console.error('Error al cancelar pago:', error);
            throw new Error(`Error en Stripe: ${error.message}`);
        }
    }

    /**
     * Verificar firma de webhook
     */
    verificarWebhookSignature(payload, signature) {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            );
            return event;
        } catch (error) {
            console.error('Error al verificar webhook:', error);
            throw new Error(`Webhook inválido: ${error.message}`);
        }
    }

    /**
     * Obtener información de un cargo (charge)
     */
    async obtenerCharge(chargeId) {
        try {
            const charge = await stripe.charges.retrieve(chargeId);
            return {
                id: charge.id,
                amount: charge.amount / 100,
                status: charge.status,
                paymentMethod: charge.payment_method_details?.type,
                last4: charge.payment_method_details?.card?.last4 || null,
                brand: charge.payment_method_details?.card?.brand || null
            };
        } catch (error) {
            console.error('Error al obtener charge:', error);
            throw new Error(`Error en Stripe: ${error.message}`);
        }
    }
}

module.exports = StripeService;
