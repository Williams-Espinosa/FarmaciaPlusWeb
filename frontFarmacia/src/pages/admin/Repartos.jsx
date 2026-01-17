import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { Truck, MapPin, Navigation } from 'lucide-react';

const Repartos = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen message="Conectando con GPS y rutas..." />;
    }

    return (
        <AdminLayout title="Logística de Repartos">
            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Seguimiento de Entregas</h1>
                    <p className="text-amber-100 text-sm font-bold">Gestiona rutas, conductores y estados de entrega en tiempo real.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6">
                        <Truck className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">Módulo Logístico</h2>
                    <p className="text-slate-500 text-sm font-bold max-w-xs">Preparando el mapa interactivo para el rastreo de unidades.</p>
                </div>
            </main>
        </AdminLayout>
    );
};

export default Repartos;
