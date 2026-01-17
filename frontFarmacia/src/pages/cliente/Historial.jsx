import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../components/cliente/CustomerLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    Package, 
    Calendar, 
    ChevronRight, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Truck,
    CreditCard,
    ExternalLink,
    Search,
    Filter,
    ShoppingBag
} from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Historial = () => {
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await api.get('/pedidos/mis-pedidos');
                setPedidos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    const getStatusStyles = (status) => {
        switch(status) {
            case 'entregado': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Entregado' };
            case 'en_transito': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Truck className="w-4 h-4" />, label: 'En Camino' };
            case 'cancelado': return { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle className="w-4 h-4" />, label: 'Cancelado' };
            default: return { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock className="w-4 h-4" />, label: 'Procesando' };
        }
    };

    if (loading) return <LoadingScreen message="Sincronizando tus pedidos..." />;

    return (
        <CustomerLayout title="Mis Historial de Compras">
            <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full -mr-16 -mt-16"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Pedidos</p>
                        <h3 className="text-4xl font-black">{pedidos.length}</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                            <ShoppingBag className="w-3 h-3" /> LISTA COMPLETA
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Compra</p>
                        <h3 className="text-xl font-black text-slate-900">
                            {pedidos.length > 0 ? new Date(pedidos[0].fecha).toLocaleDateString() : 'Ninguna'}
                        </h3>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estatus de Cuenta</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Activa</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex gap-2">
                        {['todos', 'cancelado', 'entregado'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFiltro(f)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filtro === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar pedido #..." 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {pedidos.length > 0 ? (
                        pedidos.map((pedido) => {
                            const style = getStatusStyles(pedido.estado_envio);
                            return (
                                <div key={pedido.id} className="group bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-indigo-600">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-900">Orden #FP-{pedido.id}</h4>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 ${style.bg} ${style.text}`}>
                                                    {style.icon} {style.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(pedido.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Total: <span className="text-slate-900">${parseFloat(pedido.total).toFixed(2)}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {pedido.metodo_pago === 'oxxo' && pedido.estado_pago === 'pendiente' && (
                                        <div className="bg-amber-50/50 border border-amber-100 px-6 py-3 rounded-2xl flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-amber-600 uppercase mb-0.5">Referencia OXXO</p>
                                                <p className="text-sm font-black text-slate-700 tracking-widest">{pedido.referencia}</p>
                                            </div>
                                            <div className="h-8 w-[1px] bg-amber-200"></div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-amber-400 uppercase mb-0.5">Vence</p>
                                                <p className="text-[10px] font-bold text-slate-500">{new Date(pedido.expiracion).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm">
                                            Ver Detalle
                                        </button>
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 cursor-pointer">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <ShoppingBag className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Aún no hay compras</h3>
                            <p className="text-slate-400 font-bold mb-8">Empieza a cuidar tu salud con nuestros mejores productos.</p>
                            <Link 
                                to="/cliente/catalogo"
                                className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
                            >
                                IR AL CATÁLOGO <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -ml-32 -mb-32"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl font-black italic mb-2">¿Necesitas ayuda con un pedido?</h3>
                        <p className="text-indigo-200 text-sm font-bold max-w-sm">Nuestro equipo de soporte está disponible 24/7 para resolver cualquier duda sobre tus entregas.</p>
                    </div>
                    <button className="relative z-10 bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95">
                        Contactar Soporte
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Historial;
