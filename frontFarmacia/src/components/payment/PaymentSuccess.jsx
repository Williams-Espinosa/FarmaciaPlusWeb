import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ pedidoId, monto, metodoPago }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Success Animation Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full animate-bounce">
                                    <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-center mb-3">
                                ¡Pago Exitoso!
                            </h1>
                            <p className="text-center text-green-100 text-lg">
                                Tu pedido ha sido procesado correctamente
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8">
                        {/* Order Summary */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 mb-6 border border-slate-200">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Número de Pedido</p>
                                    <p className="text-2xl font-bold text-slate-800">#{pedidoId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-600 mb-1">Monto Pagado</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${parseFloat(monto).toFixed(2)} MXN
                                    </p>
                                </div>
                            </div>
                            {metodoPago && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-600">Método de Pago</p>
                                    <p className="text-lg font-semibold text-slate-800 capitalize">
                                        {metodoPago === 'tarjeta' ? '💳 Tarjeta Bancaria' : '🏪 OXXO Pay'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-4 mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">📋 Próximos pasos:</h3>
                            
                            <div className="flex gap-4 items-start p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900">Confirmación por email</p>
                                    <p className="text-sm text-blue-700">
                                        Te enviaremos los detalles de tu pedido a tu correo electrónico
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-purple-900">Preparación del pedido</p>
                                    <p className="text-sm text-purple-700">
                                        Estamos preparando tu pedido. Recibirás actualizaciones del estado de envío
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate(`/pedidos/${pedidoId}`)}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Package className="w-5 h-5" />
                                <span>Ver Mi Pedido</span>
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-white hover:bg-gray-50 text-slate-700 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 border-slate-200"
                            >
                                <Home className="w-5 h-5" />
                                <span>Volver al Inicio</span>
                            </button>
                        </div>

                        {/* Thank You Message */}
                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                            <p className="text-slate-600 text-lg">
                                ¡Gracias por tu compra! 💚
                            </p>
                            <p className="text-slate-500 text-sm mt-2">
                                Si tienes alguna pregunta, no dudes en contactarnos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
