import React, { useState, useEffect } from 'react';
import { 
    DollarSign, ArrowUpRight, ArrowDownRight, 
    Clock, AlertCircle, Calendar, MapPin, Activity,
    Users, Filter, MoreVertical
} from 'lucide-react';
import { 
    XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import api from '../../services/api';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVentas: "$0.00",
        nuevosUsuarios: "0",
        pedidosPendientes: "0",
        stockCritico: "0",
        ventasGrafica: [],
        pedidosRecientes: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/estadisticas/dashboard');
                const { kpis, ventasMensuales, recentOrders } = response.data;
                
                // Formatear gráfica: convertir números de día a etiquetas
                const chartData = ventasMensuales.map(item => ({
                    name: `Día ${item.dia}`,
                    ventas: parseFloat(item.total_ventas)
                }));

                setStats({
                    totalVentas: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(kpis.totalVentas),
                    nuevosUsuarios: kpis.nuevosUsuarios.toString(),
                    pedidosPendientes: kpis.pedidosPendientes.toString(),
                    stockCritico: kpis.stockCritico.toString(),
                    ventasGrafica: chartData,
                    pedidosRecientes: recentOrders
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <LoadingScreen message="Analizando métricas de negocio..." />;
    }

    return (
        <AdminLayout title="FarmaPlus Enterprise">
            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                
                {/* --- SECCIÓN 1: KPI CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Ingresos (Mes)" value={stats.totalVentas} trend="+12%" isPositive={true} icon={<DollarSign />} color="blue" />
                    <StatCard title="Nuevos Jugadores" value={stats.nuevosUsuarios} trend="+5" isPositive={true} icon={<Users />} color="purple" />
                    <StatCard title="Pedidos a Procesar" value={stats.pedidosPendientes} trend="Alert" isPositive={false} icon={<Clock />} color="amber" />
                    <StatCard title="Stock en Alerta" value={stats.stockCritico} trend="Revisar" isPositive={false} icon={<AlertCircle />} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- GRÁFICA DE RENDIMIENTO --- */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Análisis de Ingresos</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Rendimiento Mensual Real</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition">Exportar</button>
                                <select className="bg-blue-50 border-none text-xs font-bold text-blue-700 rounded-lg px-3 py-2 outline-none ring-1 ring-blue-100">
                                    <option>Este Mes</option>
                                    <option>Histórico</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            {stats.ventasGrafica.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.ventasGrafica}>
                                        <defs>
                                            <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => [`$${value}`, 'Ventas']}
                                        />
                                        <Area type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 font-bold italic">
                                    Sin datos de ventas para este periodo
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- ALERTAS DE OPERACIÓN --- */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" /> 
                                Monitor Crítico
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-amber-400 uppercase mb-1">Stock Alerta</p>
                                    <p className="text-sm font-bold">Inconsistencia en SKU</p>
                                    <p className="text-xs text-slate-400 mt-1">Hay {stats.stockCritico} productos bajo el mínimo.</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Pedidos Hoy</p>
                                    <p className="text-sm font-bold">Flujo de Operación</p>
                                    <p className="text-xs text-slate-400 mt-1">{stats.pedidosPendientes} pendientes de surtir.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all mt-8">
                            Actualizar Inventario
                        </button>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full"></div>
                    </div>
                </div>

                {/* --- TABLA DE ACTIVIDAD RECIENTE --- */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Actividad Reciente</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Últimos pedidos registrados</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 transition">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">ID / Cliente</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Fecha</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Método</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Total</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Estado</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.pedidosRecientes.map(pedido => (
                                    <TableRow 
                                        key={pedido.id}
                                        id={`#FP-${pedido.id}`} 
                                        user={pedido.usuario_nombre} 
                                        date={new Date(pedido.fecha).toLocaleDateString()} 
                                        branch={pedido.metodo_pago} 
                                        total={`$${pedido.total}`} 
                                        status={pedido.estado_pago}
                                        color={pedido.estado_pago === 'pagado' ? 'green' : pedido.estado_pago === 'cancelado' ? 'red' : 'amber'} 
                                    />
                                ))}
                                {stats.pedidosRecientes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                            No hay actividad reciente
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
};

// --- COMPONENTES ATÓMICOS (Sub-componentes) ---

const StatCard = ({ title, value, icon, trend, isPositive, color }) => {
    const theme = {
        blue: "bg-blue-50 text-blue-600 shadow-blue-100",
        purple: "bg-purple-50 text-purple-600 shadow-purple-100",
        amber: "bg-amber-50 text-amber-600 shadow-amber-100",
        red: "bg-red-50 text-red-600 shadow-red-100"
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-300 transition-all cursor-default group shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${theme[color]} group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-black ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{title}</p>
            <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{value}</h2>
        </div>
    );
};

const TableRow = ({ id, user, date, branch, total, status, color }) => {
    const badges = {
        blue: 'bg-blue-50 text-blue-600 ring-blue-100',
        green: 'bg-green-50 text-green-600 ring-green-100',
        amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    };

    return (
        <tr className="hover:bg-slate-50/80 transition-colors group">
            <td className="px-8 py-5">
                <p className="text-xs font-black text-blue-600 mb-0.5 tracking-tighter">{id}</p>
                <p className="text-sm font-bold text-slate-800 leading-none">{user}</p>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{date}</span>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-tighter">
                    <MapPin size={14} className="text-slate-300" />
                    {branch}
                </div>
            </td>
            <td className="px-8 py-5 text-sm font-black text-slate-900">{total}</td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${badges[color]}`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-5">
                <button className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                    <MoreVertical size={16} />
                </button>
            </td>
        </tr>
    );
};

// IMPORTANTE: Exportación por defecto para evitar errores en App.jsx
export default AdminDashboard;