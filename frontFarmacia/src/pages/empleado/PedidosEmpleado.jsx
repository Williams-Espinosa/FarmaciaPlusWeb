import React, { useState, useEffect } from 'react';
import StaffLayout from '../../components/empleado/StaffLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    ShoppingCart, Clock, CheckCircle2, Package, 
    MoreVertical, Search, Filter, Truck, XCircle,
    Calendar, User, CreditCard, ChevronRight, AlertCircle, X
} from 'lucide-react';
import api, { getFileUrl } from '../../services/api';

const PedidosEmpleado = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('todos');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/pedidos');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await api.get(`/pedidos/${orderId}`);
            setSelectedOrder(response.data);
            setShowDetail(true);
        } catch (error) {
            console.error('Error fetching order detail:', error);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/pedidos/${orderId}/estatus`, { nuevoEstatus: newStatus });
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                fetchOrderDetail(orderId);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estatus');
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'entregado': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Entregado' };
            case 'en_transito': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Truck className="w-4 h-4" />, label: 'En Camino' };
            case 'cancelado': return { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle className="w-4 h-4" />, label: 'Cancelado' };
            case 'pendiente': return { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock className="w-4 h-4" />, label: 'Pendiente' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', icon: <Package className="w-4 h-4" />, label: status };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                             order.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'todos' || order.estado_envio === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingScreen message="Sincronizando flujo de pedidos..." />;

    return (
        <StaffLayout title="Gestión de Pedidos">
            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Centro de <span className="text-blue-600">Logística</span></h1>
                        <p className="text-slate-400 font-bold mt-1">Supervisión y despacho de órdenes en tiempo real.</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar por ID de orden o nombre de cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <div>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-slate-900 transition-all shadow-sm appearance-none uppercase tracking-widest text-[10px]"
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="en_transito">En Camino</option>
                            <option value="entregado">Entregados</option>
                            <option value="cancelado">Cancelados</option>
                        </select>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredOrders.map(order => {
                        const style = getStatusStyles(order.estado_envio);
                        return (
                            <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-slate-900 italic">Orden #FP-{order.id}</h3>
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${style.bg} ${style.text}`}>
                                                    {style.icon} {style.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(order.fecha).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5 text-blue-600"><User className="w-3.5 h-3.5" /> {order.usuario_nombre || 'Cliente Farmaplus'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto Total</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter">${parseFloat(order.total).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Método de Pago</p>
                                                <p className="text-xs font-black text-slate-700 uppercase">{order.metodo_pago}</p>
                                            </div>
                                        </div>
                                        {order.receta_path && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                                    <AlertCircle className="w-4 h-4" />
                                                </div>
                                                <a href={getFileUrl(order.receta_path)} target="_blank" rel="noreferrer" className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Ver Receta 📋</a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button 
                                                onClick={() => fetchOrderDetail(order.id)}
                                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                                            >
                                                Ver Detalle
                                            </button>
                                            {order.estado_envio === 'pendiente' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(order.id, 'en_transito')}
                                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                                >
                                                    <Truck className="w-3 h-3" /> Despachar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Detail */}
                {showDetail && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDetail(false)}></div>
                        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 italic">Detalle de Orden #FP-{selectedOrder.id}</h2>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{selectedOrder.usuario_nombre || 'Cliente'}</p>
                                </div>
                                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
                                <div className="space-y-4">
                                    {selectedOrder.detalles.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                            <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center border border-slate-100 overflow-hidden">
                                                {item.imagen_url ? (
                                                    <img src={getFileUrl(item.imagen_url)} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                ) : (
                                                    <Package className="w-8 h-8 text-slate-200" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{item.nombre}</p>
                                                <p className="text-[10px] font-bold text-slate-400">P. Unitario: ${parseFloat(item.precio_unitario).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-blue-600 leading-none">{item.cantidad}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">unidades</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Resumen de Pago</p>
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest italic">{selectedOrder.metodo_pago}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black tracking-tighter">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-auto border-t border-slate-50 flex gap-4">
                                {selectedOrder.estado_envio === 'pendiente' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'en_transito')}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
                                    >
                                        Marcar en Camino
                                    </button>
                                )}
                                {selectedOrder.estado_envio === 'en_transito' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'entregado')}
                                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100"
                                    >
                                        Confirmar Entrega
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {filteredOrders.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-sm">
                            <ShoppingCart className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 italic mb-2">Sin pedidos registrados</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">No hay órdenes que coincidan con los criterios actuales</p>
                    </div>
                )}
            </main>
        </StaffLayout>
    );
};

export default PedidosEmpleado;
