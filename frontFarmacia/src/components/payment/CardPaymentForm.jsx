import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

const CardPaymentForm = ({ clientSecret, onSuccess, onError, monto }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });

            if (result.error) {
                setError(result.error.message);
                onError(result.error);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess(result.paymentIntent);
                }
            }
        } catch (err) {
            setError('Error al procesar el pago');
            onError(err);
        } finally {
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1e293b',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                '::placeholder': {
                    color: '#94a3b8'
                },
                iconColor: '#3b82f6'
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444'
            }
        },
        hidePostalCode: true
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-full">
                        <CreditCard className="w-8 h-8 text-white" />
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">
                    Pago con Tarjeta
                </h3>
                <p className="text-center text-slate-600 mb-6">
                    Monto a pagar: <span className="font-bold text-blue-600 text-xl">${monto.toFixed(2)} MXN</span>
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Card Element Container */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Datos de la tarjeta
                        </label>
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 focus-within:border-blue-500 transition-all duration-200 shadow-sm">
                            <CardElement options={cardElementOptions} />
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Pago 100% seguro</p>
                            <p className="text-blue-600">Encriptación SSL y procesado por Stripe</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!stripe || processing}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Procesando pago...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Pagar ${monto.toFixed(2)}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Test Cards Info (only in development) */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                        <strong>Tarjeta de prueba:</strong> 4242 4242 4242 4242
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                        Cualquier fecha futura y CVC
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardPaymentForm;
