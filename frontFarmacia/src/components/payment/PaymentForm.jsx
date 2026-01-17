import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardPaymentForm from './CardPaymentForm';
import OxxoPaymentView from './OxxoPaymentView';
import { CreditCard, Store } from 'lucide-react';

// Inicializar Stripe con tu clave pública
// TODO: Mover a variable de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_tu_clave_aqui');

const PaymentForm = ({ monto, onPaymentSuccess, onPaymentError }) => {
    const [metodoPago, setMetodoPago] = useState(null); // null, 'tarjeta', 'oxxo'
    const [clientSecret, setClientSecret] = useState(null);
    const [oxxoDetails, setOxxoDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelectMethod = async (metodo) => {
        setMetodoPago(metodo);
        setLoading(true);

        try {
            // Aquí deberías hacer una llamada a tu backend para crear el payment intent
            // Por ahora, simulamos la respuesta
            
            // En tu implementación real, harías algo como:
            // const response = await api.post('/api/pagos/create-intent', {
            //     monto,
            //     metodoPago: metodo,
            //     customerEmail: user.email
            // });

            if (metodo === 'tarjeta') {
                // Para tarjeta, necesitas el clientSecret
                // setClientSecret(response.data.clientSecret);
            } else if (metodo === 'oxxo') {
                // Para OXXO, recibes los detalles directamente
                // setOxxoDetails(response.data.oxxoDetails);
            }
        } catch (error) {
            console.error('Error al crear payment intent:', error);
            onPaymentError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentIntent) => {
        onPaymentSuccess(paymentIntent);
    };

    const handlePaymentError = (error) => {
        onPaymentError(error);
        setMetodoPago(null);
        setClientSecret(null);
    };

    // Mostrar selección de método de pago
    if (!metodoPago) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                        Selecciona tu método de pago
                    </h2>
                    <p className="text-center text-slate-600 mb-8">
                        Total a pagar: <span className="font-bold text-blue-600 text-2xl">${monto.toFixed(2)} MXN</span>
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Tarjeta */}
                        <button
                            onClick={() => handleSelectMethod('tarjeta')}
                            disabled={loading}
                            className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                        >
                            <div className="flex flex-col items-center">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <CreditCard className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    Tarjeta Bancaria
                                </h3>
                                <p className="text-sm text-slate-600 text-center mb-3">
                                    Pago inmediato con Visa, Mastercard o Amex
                                </p>
                                <div className="flex gap-2 items-center text-xs text-blue-600 font-medium">
                                    <span>🔒</span>
                                    <span>Pago seguro</span>
                                </div>
                            </div>
                        </button>

                        {/* OXXO */}
                        <button
                            onClick={() => handleSelectMethod('oxxo')}
                            disabled={loading}
                            className="group relative bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                        >
                            <div className="flex flex-col items-center">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Store className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    OXXO Pay
                                </h3>
                                <p className="text-sm text-slate-600 text-center mb-3">
                                    Paga en efectivo en cualquier OXXO
                                </p>
                                <div className="flex gap-2 items-center text-xs text-orange-600 font-medium">
                                    <span>⏱️</span>
                                    <span>Válido 3 días</span>
                                </div>
                            </div>
                        </button>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center mt-6">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Mostrar formulario de tarjeta
    if (metodoPago === 'tarjeta' && clientSecret) {
        return (
            <Elements stripe={stripePromise}>
                <CardPaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    monto={monto}
                />
            </Elements>
        );
    }

    // Mostrar ficha OXXO
    if (metodoPago === 'oxxo' && oxxoDetails) {
        return <OxxoPaymentView oxxoDetails={oxxoDetails} />;
    }

    // Loading state
    return (
        <div className="flex justify-center items-center py-20">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Preparando método de pago...</p>
            </div>
        </div>
    );
};

export default PaymentForm;
