import React, { useState, useEffect } from 'react';
import { 
    Zap, 
    Tag, 
    Clock, 
    Sparkles, 
    ShoppingCart,
    ShoppingBag,
    ChevronRight,
    Star,
    Percent,
    ArrowUpRight
} from 'lucide-react';
import CustomerLayout from '../../components/cliente/CustomerLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import api, { getFileUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const OfertasCliente = () => {
    const { openAddModal, cartCount } = useCart();
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromociones = async () => {
            try {
                const response = await api.get('/promociones/activas');
                const data = response.data;
                const mapped = data.map(p => {
                    const originalPrice = parseFloat(p.producto_precio) || 0;
                    let price = originalPrice;
                    let tag = p.tipo === '2x1' ? '2x1' : 
                            p.tipo === 'combo' ? 'Combo' : 
                            p.tipo === 'precio_fijo' ? 'Especial' : 'Oferta';
                    
                    if (p.tipo === 'porcentaje') {
                        price = originalPrice * (1 - parseFloat(p.descuento) / 100);
                        tag = `-${Math.round(p.descuento)}%`;
                    } else if (p.tipo === 'precio_fijo') {
                        price = parseFloat(p.descuento);
                    }

                    return {
                        id: p.id,
                        productoId: p.producto_id,
                        name: p.titulo || p.producto_nombre,
                        category: p.categoria_nombre || 'General',
                        originalPrice: originalPrice,
                        price: price,
                        stock: p.producto_stock || 0,
                        image: p.imagen_url || p.producto_imagen,
                        tag: tag,
                        expiry: p.fecha_fin
                    };
                });
                setPromotions(mapped);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPromociones();
    }, []);

    if (loading) return <LoadingScreen message="Cazando las mejores ofertas para ti..." />;

    const flashSales = promotions.filter(p => p.tag.includes('%') && parseInt(p.tag.replace(/[^0-9]/g, '')) >= 20).slice(0, 3);

    return (
        <CustomerLayout title="Club de Ofertas">
            <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
                
                {/* Master Brand Banner */}
                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg shadow-indigo-600/20">
                                <Star className="w-3 h-3 fill-white" /> Miembro Premium
                            </div>
                            <h2 className="text-5xl font-black italic tracking-tighter leading-none">
                                Ahorro <span className="text-indigo-400">Garantizado</span> hoy.
                            </h2>
                            <p className="text-slate-400 font-bold text-lg max-w-md">
                                Como cliente FarmaPlus, tienes acceso anticipado a liquidaciones y precios exclusivos de laboratorio.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Días de Descuento</p>
                                    <p className="text-sm font-black">LUN · MIÉ · VIE</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Promociones Hoy</p>
                                    <p className="text-sm font-black">{promotions.length} ACTIVAS</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-end">
                             <div className="w-64 h-64 bg-indigo-600 rounded-[3rem] shadow-2xl shadow-indigo-600/40 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 border-[12px] border-white/10">
                                <Percent className="w-32 h-32 text-white stroke-[3px]" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Flash Sales Row */}
                {flashSales.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Liquidación Relámpago
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-red-500 bg-red-50 px-4 py-2 rounded-full uppercase tracking-widest border border-red-100">
                                <Clock className="w-4 h-4" /> SOLO POR TIEMPO LIMITADO
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {flashSales.map(promo => (
                                <div key={promo.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-100 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 text-white flex items-center justify-center font-black text-lg rounded-bl-[2.5rem] shadow-lg">
                                        {promo.tag}
                                    </div>
                                    <div className="aspect-square bg-slate-50 rounded-3xl mb-6 p-6 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                                        <img src={getFileUrl(promo.image)} alt={promo.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="space-y-4 text-center">
                                        <h4 className="font-black text-slate-900 text-lg line-clamp-1">{promo.name}</h4>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-slate-300 line-through font-bold">${promo.originalPrice.toFixed(2)}</span>
                                            <span className="text-2xl font-black text-red-600 tracking-tighter">${promo.price.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={() => openAddModal({ id: promo.productoId, nombre: promo.name, precio: promo.price, imagen_url: promo.image })}
                                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition shadow-lg shadow-slate-200 active:scale-95"
                                        >
                                            COMPRAR AHORA
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Main List */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-4 border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Catálogo de Beneficios</h3>
                                <p className="text-slate-400 text-sm font-bold">Todas las ofertas vigentes garantizadas</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {promotions.length > 0 ? (
                            promotions.map(promo => (
                                <div key={promo.id} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group">
                                    <div className="aspect-square bg-slate-50 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center mb-6">
                                        <img src={getFileUrl(promo.image)} alt={promo.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                            {promo.tag}
                                        </span>
                                    </div>
                                    <div className="px-3 pb-4 space-y-4 mt-auto">
                                        <div>
                                            <p className="text-[8px] font-black text-indigo-500 uppercase mb-1">{promo.category}</p>
                                            <h4 className="text-sm font-black text-slate-900 line-clamp-2 h-10">{promo.name}</h4>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[8px] text-slate-300 line-through font-bold mb-0.5">${promo.originalPrice.toFixed(2)}</p>
                                                <p className="text-xl font-black text-slate-900 tracking-tighter">${promo.price.toFixed(2)}</p>
                                            </div>
                                            <button 
                                                onClick={() => openAddModal({ id: promo.productoId, nombre: promo.name, precio: promo.price, imagen_url: promo.image })}
                                                className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3.5rem] border border-2 border-dashed border-slate-200">
                                <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h4 className="text-xl font-black text-slate-900 mb-2">Estamos preparando nuevas sorpresas</h4>
                                <p className="text-slate-400 font-bold max-w-sm mx-auto mb-8 text-sm">Pronto tendremos más ofertas exclusivas para ti. Mientras tanto, explora todo nuestro inventario.</p>
                                <button 
                                    onClick={() => navigate('/cliente/catalogo')}
                                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition shadow-xl shadow-indigo-100"
                                >
                                    VOLVER AL CATÁLOGO
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer Invite */}
                <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl font-black italic mb-2 tracking-tight">¿Prefieres atención personalizada?</h3>
                        <p className="text-indigo-100 font-bold text-sm max-w-sm">Nuestros farmacéuticos expertos te asesoran para encontrar el mejor tratamiento al mejor precio.</p>
                    </div>
                    <button className="relative z-10 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-300 hover:text-indigo-900 transition-all active:scale-95 shadow-xl">
                        HABLAR CON UN EXPERTO
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default OfertasCliente;
