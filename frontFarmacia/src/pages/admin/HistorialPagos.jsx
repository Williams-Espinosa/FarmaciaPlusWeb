import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { CreditCard, DollarSign, ShieldCheck } from 'lucide-react';

const HistorialPagos = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen message="Verificando pasarelas de pago..." />;
    }

    return (
        <AdminLayout title="Historial de Pagos">
            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Pasarela de Pagos</h1>
                    <p className="text-slate-400 text-sm font-bold">Verifica el estado de las transacciones y conciliaciones bancarias.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                        <CreditCard className="w-10 h-10 text-slate-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">Conciliación Financiera</h2>
                    <p className="text-slate-500 text-sm font-bold max-w-xs">Enlazando con Stripe y PayPal para el historial de transacciones.</p>
                </div>
            </main>
        </AdminLayout>
    );
};

export default HistorialPagos;
