import React, { useState, useEffect } from 'react';
import { 
    Users, 
    TrendingUp, 
    ShoppingBag, 
    Store, 
    Filter,
    Calendar,
    ArrowUpRight,
    Search,
    Download
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
} from 'recharts';
import api from '../../services/api';
import StaffLayout from '../../components/empleado/StaffLayout';

const Clientes = () => {
    const [stats, setStats] = useState({
        topClientes: [],
        ventasMensuales: [],
        canalStats: []
    });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });

    const years = [2024, 2025];
    const months = [
        { val: 1, name: 'Enero' }, { val: 2, name: 'Febrero' }, { val: 3, name: 'Marzo' },
        { val: 4, name: 'Abril' }, { val: 5, name: 'Mayo' }, { val: 6, name: 'Junio' },
        { val: 7, name: 'Julio' }, { val: 8, name: 'Agosto' }, { val: 9, name: 'Septiembre' },
        { val: 10, name: 'Octubre' }, { val: 11, name: 'Noviembre' }, { val: 12, name: 'Diciembre' }
    ];

    useEffect(() => {
        fetchStats();
    }, [filters]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/estadisticas/dashboard', { params: filters });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const processCanalData = (data) => {
        return data.map(item => ({
            name: item.canal === 'en_tienda' ? 'Física' : 'En Línea',
            value: Number(item.cantidad)
        }));
    };

    return (
        <StaffLayout title="Dashboard de Clientes">
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Análisis <span className="text-blue-600">Comercial</span></h1>
                        <p className="text-slate-400 font-bold text-sm">Monitoreo de frecuencia y comportamiento de compra en tiempo real.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl shadow-xl shadow-slate-100 border border-slate-50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <select 
                                value={filters.year}
                                onChange={(e) => setFilters({...filters, year: e.target.value})}
                                className="bg-transparent text-xs font-black outline-none text-slate-900 uppercase tracking-widest"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <Filter className="w-4 h-4 text-blue-600" />
                            <select 
                                value={filters.month}
                                onChange={(e) => setFilters({...filters, month: e.target.value})}
                                className="bg-transparent text-xs font-black outline-none text-slate-900 uppercase tracking-widest"
                            >
                                {months.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:border-blue-200 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                             <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Users className="w-8 h-8" />
                             </div>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Top Cliente</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 italic line-clamp-1">
                            {stats.topClientes[0]?.nombre || '---'}
                        </h3>
                        <p className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-tighter">Mayor volumen de compra</p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                             <div className="p-4 bg-white/10 rounded-2xl text-blue-400">
                                <Store className="w-8 h-8" />
                             </div>
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">Canal Líder</span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic capitalize relative z-10">
                            {stats.canalStats && stats.canalStats.length > 0
                                ? stats.canalStats.sort((a,b) => b.cantidad - a.cantidad)[0]?.canal?.replace('_', ' ') 
                                : '---'}
                        </h3>
                        <p className="text-xs font-bold text-blue-400 mt-2 uppercase tracking-tighter relative z-10">Punto de mayor afluencia</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:border-emerald-200 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                             <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                <ShoppingBag className="w-8 h-8" />
                             </div>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Ventas Mes</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 italic">
                            ${stats.ventasMensuales.reduce((acc, curr) => acc + Number(curr.total_ventas), 0).toFixed(2)}
                        </h3>
                        <p className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-tighter">Proyección mensual actual</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Chart */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    Actividad de Ventas
                                </h3>
                                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Movimiento diario del mes</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.ventasMensuales}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="dia" 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        fontWeight="bold"
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(v) => `$${v}`}
                                        fontWeight="bold"
                                    />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{fontWeight: 'black', fontSize: '12px'}}
                                    />
                                    <Bar 
                                        dataKey="total_ventas" 
                                        fill="#4f46e5" 
                                        radius={[10, 10, 0, 0]} 
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Channel Distribution */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <Store className="w-6 h-6 text-indigo-600" />
                                    Origen de Pedidos
                                </h3>
                                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Distribución por canal de venta</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full flex flex-col md:flex-row items-center justify-center gap-10">
                            <div className="flex-1 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={processCanalData(stats.canalStats)}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={12}
                                            dataKey="value"
                                        >
                                            {processCanalData(stats.canalStats).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-6 min-w-[180px]">
                                {processCanalData(stats.canalStats).map((item, index) => (
                                    <div key={item.name} className="flex items-center gap-4 group">
                                        <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">{item.value} <span className="text-[10px] text-slate-300">ORD.</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 italic">Ranking de <span className="text-blue-600">Lealtad</span></h3>
                            <p className="text-slate-400 font-bold text-sm">Nuestros clientes más activos en el periodo seleccionado.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                                <Download className="w-4 h-4" /> EXPORTAR REPORTE
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidad del Cliente</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Frecuencia</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Facturación</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.topClientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 flex items-center justify-center text-blue-600 font-black text-xl shadow-sm text-indigo-400">
                                                    {cliente.nombre[0]}
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-900 italic">{cliente.nombre}</p>
                                                    <p className="text-xs font-bold text-slate-400 lowercase">{cliente.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="inline-flex items-center px-5 py-2 rounded-xl bg-white border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {cliente.total_compras} Compras
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                           <p className="text-lg font-black text-slate-900 tracking-tighter">${Number(cliente.total_gastado).toFixed(2)}</p>
                                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Liquidado</p>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-[1.25rem] flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-90 group/btn">
                                                <ArrowUpRight className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {stats.topClientes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-slate-200">
                                                    <Search className="w-8 h-8 text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Sin registros en este periodo</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
};

export default Clientes;
