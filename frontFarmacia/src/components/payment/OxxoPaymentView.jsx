import { Download, Printer, CheckCircle, Clock } from 'lucide-react';

const OxxoPaymentView = ({ oxxoDetails }) => {
    const { referencia, monto, expira, hostedVoucherUrl, instrucciones } = oxxoDetails;

    const handleDownload = () => {
        if (hostedVoucherUrl) {
            window.open(hostedVoucherUrl, '_blank');
        }
    };

    const handlePrint = () => {
        if (hostedVoucherUrl) {
            const printWindow = window.open(hostedVoucherUrl, '_blank');
            if (printWindow) {
                printWindow.addEventListener('load', () => {
                    printWindow.print();
                });
            }
        }
    };

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2">
                        ¡Pedido Creado!
                    </h2>
                    <p className="text-center text-orange-100 text-lg">
                        Ficha de pago OXXO generada
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Amount */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-orange-200">
                        <p className="text-center text-slate-600 text-lg mb-2">Monto a pagar</p>
                        <p className="text-center text-5xl font-bold text-orange-600">
                            ${parseFloat(monto).toFixed(2)}
                            <span className="text-2xl text-slate-500 ml-2">MXN</span>
                        </p>
                    </div>

                    {/* Reference Number */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-orange-200">
                        <label className="block text-sm font-medium text-slate-600 text-center mb-3">
                            Número de Referencia
                        </label>
                        <div className="bg-slate-100 rounded-lg p-4 border-2 border-dashed border-orange-300">
                            <p className="text-center text-3xl font-mono font-bold text-slate-800 tracking-wider">
                                {referencia}
                            </p>
                        </div>
                        <p className="text-sm text-slate-500 text-center mt-3">
                            Dicta este número al cajero en OXXO
                        </p>
                    </div>

                    {/* Expiration */}
                    <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div className="text-sm">
                            <span className="font-medium text-yellow-800">Válido hasta: </span>
                            <span className="text-yellow-700">{formatFecha(expira)}</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-blue-900 mb-3 text-lg">📋 Instrucciones:</h3>
                        <ol className="space-y-2 text-blue-800">
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600">1.</span>
                                <span>Acude a cualquier tienda OXXO</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600">2.</span>
                                <span>Dicta el número de referencia al cajero o muestra el código de barras</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600">3.</span>
                                <span>Realiza el pago en efectivo</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600">4.</span>
                                <span>Guarda tu comprobante</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600">5.</span>
                                <span>Tu pedido se procesará automáticamente al confirmar el pago</span>
                            </li>
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Descargar Ficha</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-white hover:bg-gray-50 text-orange-600 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 border-orange-500"
                        >
                            <Printer className="w-5 h-5" />
                            <span>Imprimir</span>
                        </button>
                    </div>

                    {/* Important Notice */}
                    <div className="mt-6 pt-6 border-t border-orange-200">
                        <p className="text-sm text-slate-600 text-center">
                            <strong>Importante:</strong> Conserva tu número de referencia. 
                            Recibirás un correo de confirmación cuando se procese tu pago.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OxxoPaymentView;
