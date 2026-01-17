import React, { useState } from 'react';
import CustomerLayout from '../../components/cliente/CustomerLayout';
import { useCart } from '../../context/CartContext';
import { 
    Trash2, 
    Plus, 
    Minus, 
    ShoppingBag, 
    ArrowRight, 
    CreditCard, 
    ShieldCheck, 
    ChevronRight,
    Search,
    ShoppingBag as LogoIcon,
    AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getFileUrl } from '../../services/api';

const Carrito = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState('');

    const shipping = cartTotal > 1000 ? 0 : 50;
    const finalTotal = cartTotal + shipping;

    return (
        <CustomerLayout title="Mi Selección de Salud">
            <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {cart.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                        
                        {/* List Area */}
                        <div className="xl:col-span-2 space-y-8">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-indigo-600" /> 
                                    Productos en Carrito ({cartCount})
                                </h3>
                                <button 
                                    onClick={clearCart}
                                    className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition underline underline-offset-4"
                                >
                                    Vaciar Todo
                                </button>
                            </div>

                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-500 hover:border-indigo-100">
                                        <div className="flex items-center gap-8 w-full sm:w-auto">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[1.5rem] p-4 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white transition-colors overflow-hidden">
                                                <img 
                                                    src={getFileUrl(item.imagen_url) || 'https://via.placeholder.com/150'} 
                                                    alt={item.nombre}
                                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-900 text-lg leading-tight truncate mb-1">
                                                    {item.nombre}
                                                </h4>
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                                                    Precio: ${item.precio.toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 shadow-inner">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-10 text-center font-black text-sm text-slate-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Subtotal</p>
                                                <p className="text-xl font-black text-slate-900 tracking-tighter">
                                                    ${(item.precio * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => navigate('/cliente/catalogo')}
                                className="flex items-center gap-3 text-xs font-black text-indigo-600 hover:translate-x-2 transition-all uppercase tracking-widest py-4 px-2"
                            >
                                <ChevronRight className="w-5 h-5 rotate-180" /> Continuar Comprando
                            </button>
                        </div>

                        {/* Summary Area */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-indigo-100/50 space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
                                
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 relative z-10 italic">
                                    Resumen de Órden
                                </h3>

                                <div className="space-y-5 relative z-10 border-b border-slate-100 pb-8">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span>Subtotal de Productos</span>
                                        <span className="text-slate-900">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span>Cuota de Envío</span>
                                        <span className={shipping === 0 ? 'text-emerald-500 font-black' : 'text-slate-900'}>
                                            {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-4 border border-indigo-100/50">
                                            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-indigo-600 font-black leading-relaxed italic">
                                                ¡Agrega ${ (1000 - cartTotal).toFixed(2) } más para recibir envío GRATIS!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-2">Total a Pagar</p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">${finalTotal.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                             <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                                                <ShieldCheck className="w-3 h-3" /> Transacción Segura
                                             </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-2 flex gap-2 border border-slate-100 shadow-inner">
                                        <input 
                                            type="text" 
                                            placeholder="Código de Descuento"
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            className="flex-1 bg-transparent px-4 py-3 outline-none font-bold text-xs text-slate-900 placeholder:text-slate-300"
                                        />
                                        <button className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition shadow-lg active:scale-95">
                                            Aplicar
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-indigo-600 text-white py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-slate-900 hover:shadow-2xl shadow-indigo-200 active:scale-95"
                                    >
                                        Procesar Compra <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                        <CreditCard className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black italic mb-1 uppercase tracking-widest">Métodos de Pago</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">Tarjeta, OXXO Pay y Transferencia SPEI totalmente protegidos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="py-32 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 shadow-sm max-w-4xl mx-auto w-full">
                        <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-indigo-200 shadow-xl shadow-indigo-100 animate-pulse">
                            <ShoppingBag className="w-16 h-16" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 italic tracking-tighter">Tu carrito está esperando...</h2>
                        <p className="text-slate-400 font-bold mb-10 max-w-sm mx-auto leading-relaxed">
                            No pierdas la oportunidad de cuidar tu salud con los mejores precios del mercado.
                        </p>
                        <Link 
                            to="/cliente/catalogo"
                            className="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] inline-flex items-center gap-4 hover:bg-slate-900 hover:shadow-2xl shadow-indigo-100 transition-all active:scale-95"
                        >
                            Explorar Farmacia <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
};

export default Carrito;
