import React, { useState, useEffect } from 'react';
import StaffLayout from '../../components/empleado/StaffLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    Search, Plus, Minus, Trash2, ShoppingCart, 
    CreditCard, Banknote, User, Package, CheckCircle2,
    X, AlertCircle, Barcode, Trash
} from 'lucide-react';
import api, { getFileUrl } from '../../services/api';

const VentaTienda = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Estados para Pago en Efectivo
    const [showPayModal, setShowPayModal] = useState(false);
    const [amountTendered, setAmountTendered] = useState('');
    const [change, setChange] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, custRes] = await Promise.all([
                api.get('/productos'),
                api.get('/usuarios/buscar?rol=cliente') 
            ]);
            setProducts(prodRes.data);
            setCustomers(custRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                alert('No hay más stock disponible');
                return;
            }
            setCart(cart.map(item => 
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.stock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

    const initiateCheckout = (metodo) => {
        if (cart.length === 0) return;
        
        if (metodo === 'efectivo') {
            setAmountTendered('');
            setChange(null);
            setShowPayModal(true);
        } else {
            processSale(metodo);
        }
    };

    const calculateChange = (val) => {
        setAmountTendered(val);
        const received = parseFloat(val);
        if (!isNaN(received) && received >= total) {
            setChange(received - total);
        } else {
            setChange(null);
        }
    };

    const processSale = async (metodo) => {
        setProcessing(true);
        try {
            const saleData = {
                productos: JSON.stringify(cart.map(item => ({
                    id: item.id,
                    cantidad: item.quantity,
                    precio: item.precio
                }))),
                metodo_pago: metodo,
                total: total,
                usuarioId: selectedCustomer?.id || null,
                usuarioEmail: selectedCustomer?.email
            };

            await api.post('/pedidos/mostrador', saleData);
            setCart([]);
            setSelectedCustomer(null);
            setShowPayModal(false);
            setShowSuccess(true);
            fetchData(); 
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error al procesar la venta: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.codigo_barras?.includes(searchTerm)
    );

    if (loading) return <LoadingScreen message="Inicializando Terminal de Punto de Venta..." />;

    return (
        <StaffLayout title="Venta en Mostrador">
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                
                {/* Product Selection Area */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-6 h-6" />
                            <input 
                                type="text"
                                placeholder="Escanear código de barras o buscar medicina..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-lg transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <button 
                                    key={product.id}
                                    disabled={product.stock <= 0}
                                    onClick={() => addToCart(product)}
                                    className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col group relative overflow-hidden ${product.stock <= 0 ? 'opacity-50 grayscale' : 'active:scale-95'}`}
                                >
                                    <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-4 p-4 flex items-center justify-center relative overflow-hidden">
                                        {product.imagen_url ? (
                                            <img src={getFileUrl(product.imagen_url)} alt="" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <Package className="w-10 h-10 text-slate-200" />
                                        )}
                                        {product.stock <= 10 && product.stock > 0 && (
                                            <div className="absolute top-2 right-2 bg-amber-100 text-amber-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">Stock Bajo</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.categoria_nombre || 'Farmacia'}</p>
                                        <h4 className="font-black text-slate-900 line-clamp-2 leading-tight mb-2 uppercase italic text-sm">{product.nombre}</h4>
                                        <div className="flex items-center justify-between mt-auto">
                                            <p className="text-xl font-black text-slate-900 tracking-tighter">${parseFloat(product.precio).toFixed(2)}</p>
                                            <p className="text-[10px] font-bold text-slate-400">Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* POS Sidebar / Cart */}
                <aside className="w-[400px] bg-white border-l border-slate-100 flex flex-col shadow-2xl z-20">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Carrito <span className="text-blue-600">Actual</span></h3>
                        </div>

                        {/* Customer Selector */}
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600" />
                            <select 
                                onChange={(e) => setSelectedCustomer(customers.find(c => c.id === parseInt(e.target.value)))}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none uppercase tracking-widest"
                            >
                                <option value="">Venta General (Público)</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border border-slate-100">
                                    <Package className="w-10 h-10" />
                                </div>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest leading-relaxed max-w-[150px]">Escanea o selecciona productos para iniciar</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-blue-100 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-100 shrink-0">
                                        <img src={getFileUrl(item.imagen_url)} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-[11px] font-black text-slate-900 uppercase truncate mb-2">{item.nombre}</h5>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                                    <Minus className="w-3 h-3 text-slate-400" />
                                                </button>
                                                <span className="text-xs font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                                    <Plus className="w-3 h-3 text-slate-400" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-black text-blue-600">${(item.precio * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-8 bg-slate-50 space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total de Venta</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => initiateCheckout('efectivo')}
                                disabled={cart.length === 0 || processing}
                                className="flex flex-col items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:grayscale active:scale-95"
                            >
                                <Banknote className="w-5 h-5" /> EFECTIVO
                            </button>
                            <button 
                                onClick={() => initiateCheckout('oxxo')}
                                disabled={cart.length === 0 || processing}
                                className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:grayscale active:scale-95"
                            >
                                <CreditCard className="w-5 h-5" /> DIGITAL
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Payment Modal (Cash) */}
            {showPayModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPayModal(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 border border-blue-100">
                                <Banknote className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 italic">Pago en Efectivo</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Introduce el monto recibido</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total a Pagar</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</p>
                            </div>

                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300">$</span>
                                <input 
                                    type="number" 
                                    autoFocus
                                    placeholder="0.00"
                                    value={amountTendered}
                                    onChange={(e) => calculateChange(e.target.value)}
                                    className="w-full pl-10 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-center outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {change !== null && (
                                <div className="bg-emerald-50 p-6 rounded-[2rem] text-center border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Cambio a Entregar</p>
                                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">${change.toFixed(2)}</p>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setShowPayModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={() => processSale('efectivo')}
                                    disabled={change === null || processing}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:grayscale"
                                >
                                    {processing ? '...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowSuccess(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-12 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                             <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 italic">¡Venta Exitosa!</h3>
                        <p className="text-slate-400 font-bold text-sm mb-10 px-4 leading-relaxed">La transacción se ha procesado correctamente. No olvides entregar el ticket.</p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"
                        >
                            INICIAR NUEVA VENTA
                        </button>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
};

export default VentaTienda;
