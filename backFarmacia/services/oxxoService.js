const stripe = require('../configs/stripeConfig');

class OxxoService {
    constructor(pagoOxxoRepository) {
        this.pagoOxxoRepository = pagoOxxoRepository;
    }

    async generarReferencia(pedido, cliente) {
        try {
            // Convertir monto a centavos (Stripe trabaja en centavos)
            const montoCentavos = Math.round(pedido.total * 100);

            // Crear Payment Intent con método OXXO
            const paymentIntent = await stripe.paymentIntents.create({
                amount: montoCentavos,
                currency: 'mxn',
                payment_method_types: ['oxxo'],
                receipt_email: cliente.email || cliente.usuarioEmail,
                metadata: {
                    pedido_id: pedido.id.toString(),
                    cliente_nombre: cliente.nombre || 'Cliente'
                },
                payment_method_options: {
                    oxxo: {
                        expires_after_days: 3 // La ficha expira en 3 días
                    }
                }
            });

            // Confirmar el payment intent para generar la ficha OXXO
            const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);

            // Extraer detalles de OXXO
            const oxxoDetails = confirmedPaymentIntent.next_action?.oxxo_display_details;

            if (!oxxoDetails) {
                throw new Error('No se pudo generar la ficha OXXO');
            }

            const fechaExpiracion = new Date(oxxoDetails.expires_after * 1000);

            // Guardar en base de datos
            await this.pagoOxxoRepository.saveReference(
                pedido.id,
                oxxoDetails.number, // Número de referencia OXXO
                pedido.total,
                fechaExpiracion,
                paymentIntent.id // Guardar payment intent ID
            );

            return {
                referencia: oxxoDetails.number,
                monto: pedido.total,
                expira: fechaExpiracion,
                hostedVoucherUrl: oxxoDetails.hosted_voucher_url,
                paymentIntentId: paymentIntent.id,
                instrucciones: "Ve a cualquier tienda OXXO y dicta estos números al cajero o muestra el código de barras."
            };
        } catch (error) {
            console.error("Error al generar pago Oxxo con Stripe:", error);
            throw new Error(`No se pudo generar la ficha de pago: ${error.message}`);
        }
    }
}

module.exports = OxxoService;