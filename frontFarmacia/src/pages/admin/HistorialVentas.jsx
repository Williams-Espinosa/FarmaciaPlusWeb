import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

const HistorialVentas = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen message="Generando reporte de ingresos..." />;
    }

    return (
        <AdminLayout title="Ventas Realizadas">
            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Reporte de Ingresos</h1>
                    <p className="text-emerald-100 text-sm font-bold">Consulta el balance detallado de todas las transacciones completadas.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6">
                        <TrendingUp className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">Módulo de Ventas</h2>
                    <p className="text-slate-500 text-sm font-bold max-w-xs">Generando reportes financieros y filtros por fecha/sucursal.</p>
                </div>
            </main>
        </AdminLayout>
    );
};

export default HistorialVentas;
