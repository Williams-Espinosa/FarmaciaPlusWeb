import React, { useState, useEffect } from 'react';
import { 
    Search, 
    ShoppingCart, 
    Filter, 
    ChevronDown, 
    X, 
    ShoppingBag, 
    Tag, 
    Clock, 
    ArrowRight,
    Heart,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Package
} from 'lucide-react';
import CustomerLayout from '../../components/cliente/CustomerLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import api, { getFileUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CatalogoCliente = () => {
    const { openAddModal, cartCount, cartTotal } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [priceRange, setPriceRange] = useState(2000);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias')
                ]);
                setProducts(prodRes.data);
                setCategories([{ id: 'todos', nombre: 'Todos' }, ...catRes.data]);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'Todos' || p.categoria_nombre === selectedCategory;
        const matchesPrice = parseFloat(p.precio) <= priceRange;
        return matchesSearch && matchesCat && matchesPrice;
    });

    if (loading) return <LoadingScreen message="Preparando el catálogo maestro..." />;

    return (
        <CustomerLayout title="Catálogo Digital">
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Promo Banner */}
                <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="relative z-10 space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                            <Tag className="w-4 h-4 text-yellow-300" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oferta de Invierno</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter leading-none">
                            20% de descuento en Vitaminas <span className="text-yellow-300">Seleccionadas</span>
                        </h2>
                        <p className="text-indigo-100 font-bold text-sm">Cuida tu salud con los mejores complementos alimenticios.</p>
                        <button 
                            onClick={() => navigate('/cliente/ofertas')}
                            className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 hover:text-indigo-900 transition-all active:scale-95"
                        >
                            VER OFERTAS
                        </button>
                    </div>
                    <div className="relative z-10 w-64 h-64 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md flex items-center justify-center">
                        <Package className="w-32 h-32 text-white/20 animate-bounce" />
                    </div>
                </div>

                {/* Floating Cart Button (Mobile/Quick Access) */}
                <div className="fixed bottom-8 right-8 z-50 lg:hidden">
                    <button 
                        onClick={() => navigate('/cliente/carrito')}
                        className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-2xl shadow-indigo-200 relative group flex items-center gap-4 border-4 border-white active:scale-95 transition-all"
                    >
                        <ShoppingCart className="w-8 h-8" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-900 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                                {cartCount}
                            </span>
                        )}
                        <span className="font-black text-sm uppercase tracking-widest pr-2">Ver Carrito</span>
                    </button>
                </div>

                {/* Search & Stats Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="relative w-full lg:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar en farmacia..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300 shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showFilters ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}
                        >
                            <Filter className="w-4 h-4" /> Filtros
                        </button>
                        <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-slate-100">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tu Carrito</p>
                                <p className="text-sm font-black text-indigo-600 leading-none">${cartTotal.toFixed(2)}</p>
                             </div>
                             <button 
                                onClick={() => navigate('/cliente/carrito')}
                                className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl relative hover:bg-indigo-600 hover:text-white transition-all group"
                             >
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-indigo-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                                        {cartCount}
                                    </span>
                                )}
                             </button>
                        </div>
                    </div>
                </div>

                {/* Filters Drawer */}
                {showFilters && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-10 animate-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-indigo-500" /> Clasificación
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => setSelectedCategory(cat.nombre)}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.nombre ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-emerald-500" /> Rango de Inversión
                                </h4>
                                <div className="space-y-4 px-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="5000" 
                                        step="100"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">$0</span>
                                        <span className="text-sm font-black text-indigo-600 uppercase tracking-tighter italic">Hasta ${priceRange} MXN</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end flex-col justify-end">
                                <button 
                                    onClick={() => {setSelectedCategory('Todos'); setPriceRange(5000);}}
                                    className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition underline underline-offset-4"
                                >
                                    Reiniciar Búsqueda
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-3 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 relative flex flex-col">
                                {product.requiere_receta === 1 && (
                                    <div className="absolute top-6 right-6 z-10 bg-slate-900 text-white p-2 rounded-xl shadow-lg border border-white/20">
                                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                                    </div>
                                )}
                                
                                {/* Image Container */}
                                <div className="aspect-square rounded-[2rem] bg-slate-50 relative overflow-hidden flex items-center justify-center p-8 group-hover:bg-indigo-50/50 transition-colors duration-500">
                                    <img 
                                        src={getFileUrl(product.imagen_url) || 'https://via.placeholder.com/150'} 
                                        alt={product.nombre}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-500"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4 flex-1 flex flex-col">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                                                {product.categoria_nombre}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-2">
                                            {product.nombre}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-bold line-clamp-1 italic">
                                            {product.descripcion || 'Fórmula farmacéutica certificada.'}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1 tracking-widest">Precio</span>
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                                ${parseFloat(product.precio).toFixed(2)}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                openAddModal({
                                                    id: product.id,
                                                    nombre: product.nombre,
                                                    precio: parseFloat(product.precio),
                                                    imagen_url: product.imagen_url
                                                });
                                            }}
                                            className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-slate-900 hover:shadow-indigo-200 transition-all active:scale-90 group/btn"
                                        >
                                            <ShoppingCart className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                             <Search className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                             <h3 className="text-2xl font-black text-slate-900 mb-2">Sin resultados exactos</h3>
                             <p className="text-slate-400 font-bold">Prueba buscando con otro nombre o ajustando los filtros.</p>
                             <button 
                                onClick={() => setSearchQuery('')}
                                className="mt-8 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase"
                             >
                                Ver Todo el Catálogo
                             </button>
                        </div>
                    )}
                </div>

                {/* Master Info Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                <Clock className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic mb-2 tracking-tight">Servicio 24/7</h3>
                                <p className="text-slate-400 text-sm font-bold leading-relaxed">Pedidos en línea disponibles en todo momento. Entregas programadas según tu zona.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-indigo-50 rounded-[2.5rem] p-10 border border-indigo-100 relative overflow-hidden group">
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic mb-2 text-indigo-900 tracking-tight">Calidad Certificada</h3>
                                <p className="text-indigo-600/60 text-sm font-bold leading-relaxed">Todos nuestros medicamentos cumplen con las normas oficiales de salud.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CatalogoCliente;
