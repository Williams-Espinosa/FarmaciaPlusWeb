import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { ShoppingCart, Clock, CheckCircle, Package, MoreVertical } from 'lucide-react';

const Pedidos = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen message="Cargando logística de pedidos..." />;
    }

    return (
        <AdminLayout title="Gestión de Pedidos">
            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Órdenes y Logística</h1>
                    <p className="text-blue-100 text-sm font-bold">Rastrea cada pedido desde la compra hasta la entrega final.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingCart className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">Módulo de Pedidos</h2>
                    <p className="text-slate-500 text-sm font-bold max-w-xs">Integrando con el sistema de checkout para mostrar ventas en vivo.</p>
                </div>
            </main>
        </AdminLayout>
    );
};

export default Pedidos;
