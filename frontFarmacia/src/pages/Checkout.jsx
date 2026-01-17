import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../services/api';
import CardPaymentForm from '../components/payment/CardPaymentForm';
import OxxoPaymentView from '../components/payment/OxxoPaymentView';
import PaymentSuccess from '../components/payment/PaymentSuccess';
import { ShoppingCart, Trash2, CreditCard, Store, Loader } from 'lucide-react';

// Inicializar Stripe (la clave pública es segura exponerla)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const Checkout = () => {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [paso, setPaso] = useState('carrito'); // 'carrito', 'seleccion-pago', 'pago-tarjeta', 'pago-oxxo', 'exito'
    const [metodoPago, setMetodoPago] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [oxxoDetails, setOxxoDetails] = useState(null);
    const [pedidoId, setPedidoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar carrito desde localStorage al montar
    useEffect(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    }, []);

    const calcularTotal = () => {
        return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    };

    const eliminarDelCarrito = (index) => {
        const nuevoCarrito = carrito.filter((_, i) => i !== index);
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    };

    const actualizarCantidad = (index, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        const nuevoCarrito = [...carrito];
        nuevoCarrito[index].cantidad = nuevaCantidad;
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    };

    const handleSeleccionMetodo = async (metodo) => {
        setMetodoPago(metodo);
        setLoading(true);
        setError(null);

        try {
            const total = calcularTotal();
            const userEmail = localStorage.getItem('userEmail') || 'cliente@example.com';

            // Crear el pedido primero
            const pedidoData = {
                productos: JSON.stringify(carrito.map(item => ({
                    id: item.id,
                    cantidad: item.cantidad,
                    precio: item.precio
                }))),
                metodo_pago: metodo,
                total: total
            };

            const pedidoRes = await api.post('/pedidos', pedidoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPedidoId(pedidoRes.data.pedidoId);

            // Crear payment intent
            const paymentIntentData = {
                monto: total,
                metodoPago: metodo,
                pedidoId: pedidoRes.data.pedidoId,
                customerEmail: userEmail
            };

            const res = await api.post('/pagos/create-intent', paymentIntentData);

            if (metodo === 'tarjeta') {
                setClientSecret(res.data.clientSecret);
                setPaso('pago-tarjeta');
            } else if (metodo === 'oxxo') {
                // Para OXXO, los detalles vienen en la respuesta
                if (res.data.oxxoDetails) {
                    setOxxoDetails({
                        referencia: res.data.oxxoDetails.number,
                        monto: total,
                        expira: res.data.oxxoDetails.expiresAfter,
                        hostedVoucherUrl: res.data.oxxoDetails.hostedVoucherUrl,
                        instrucciones: "Ve a cualquier tienda OXXO y dicta estos números al cajero o muestra el código de barras."
                    });
                    setPaso('pago-oxxo');
                }
            }
        } catch (err) {
            console.error('Error al crear payment intent:', err);
            setError(err.response?.data?.error || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentIntent) => {
        // Limpiar carrito
        setCarrito([]);
        localStorage.removeItem('carrito');
        setPaso('exito');
    };

    const handlePaymentError = (error) => {
        setError(error.message || 'Error al procesar el pago');
        setPaso('seleccion-pago');
        setMetodoPago(null);
        setClientSecret(null);
    };

    // Vista de carrito vacío
    if (carrito.length === 0 && paso === 'carrito') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">Tu carrito está vacío</h2>
                    <p className="text-slate-500 mb-6">Agrega productos para continuar</p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
                    >
                        Ver Catálogo
                    </button>
                </div>
            </div>
        );
    }

    // Vista de éxito
    if (paso === 'exito') {
        return (
            <PaymentSuccess
                pedidoId={pedidoId}
                monto={calcularTotal()}
                metodoPago={metodoPago}
            />
        );
    }

    // Vista de pago OXXO
    if (paso === 'pago-oxxo' && oxxoDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
                <OxxoPaymentView oxxoDetails={oxxoDetails} />
            </div>
        );
    }

    // Vista de pago con tarjeta
    if (paso === 'pago-tarjeta' && clientSecret) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
                <Elements stripe={stripePromise}>
                    <CardPaymentForm
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        monto={calcularTotal()}
                    />
                </Elements>
            </div>
        );
    }

    // Vista de selección de método de pago
    if (paso === 'seleccion-pago') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                            Selecciona tu método de pago
                        </h2>
                        <p className="text-center text-slate-600 mb-8">
                            Total a pagar: <span className="font-bold text-blue-600 text-2xl">${calcularTotal().toFixed(2)} MXN</span>
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Tarjeta */}
                            <button
                                onClick={() => handleSeleccionMetodo('tarjeta')}
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
                                onClick={() => handleSeleccionMetodo('oxxo')}
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
                            <div className="flex justify-center items-center py-4">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        )}

                        <button
                            onClick={() => setPaso('carrito')}
                            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                        >
                            Volver al carrito
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Vista principal del carrito
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <ShoppingCart className="w-10 h-10" />
                    Tu Carrito
                </h1>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Items del carrito */}
                    <div className="p-6 space-y-4">
                        {carrito.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <img
                                    src={item.imagen_url || '/placeholder-producto.png'}
                                    alt={item.nombre}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800">{item.nombre}</h3>
                                    <p className="text-sm text-slate-600">${item.precio.toFixed(2)} c/u</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                                        className="bg-slate-200 hover:bg-slate-300 w-8 h-8 rounded-lg flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">{item.cantidad}</span>
                                    <button
                                        onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                                        className="bg-slate-200 hover:bg-slate-300 w-8 h-8 rounded-lg flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-right w-24">
                                    <p className="font-bold text-blue-600">
                                        ${(item.precio * item.cantidad).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => eliminarDelCarrito(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total y botón de pagar */}
                    <div className="bg-slate-100 p-6 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-semibold text-slate-700">Total:</span>
                            <span className="text-3xl font-bold text-blue-600">
                                ${calcularTotal().toFixed(2)} MXN
                            </span>
                        </div>
                        <button
                            onClick={() => setPaso('seleccion-pago')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;