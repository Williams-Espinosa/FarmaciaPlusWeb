import React, { useState, useEffect } from 'react';
import StaffLayout from '../../components/empleado/StaffLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    Package, Search, Filter, AlertTriangle, CheckCircle2, 
    X, ImageIcon, Barcode, Hash
} from 'lucide-react';
import api, { getFileUrl } from '../../services/api';

const InventarioEmpleado = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.codigo_barras?.includes(searchTerm);
        const matchesCategory = filterCategory === 'all' || p.categoria_id === parseInt(filterCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <LoadingScreen message="Sincronizando inventario operativo..." />;
    }

    return (
        <StaffLayout title="Control de Inventario">
            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Existencias <span className="text-blue-600">Actuales</span></h1>
                        <p className="text-slate-400 font-bold mt-1">Consulta rápida de stock y disponibilidad para atención al cliente.</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center gap-6 px-10">
                        <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Catálogo Total</p>
                                <p className="text-xl font-black text-slate-900 leading-none">{products.length} SKU</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Stock Crítico</p>
                                <p className="text-xl font-black text-slate-900 leading-none">{products.filter(p => p.stock <= 10).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, principio activo o código..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                            <Filter className="w-5 h-5" />
                        </div>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-slate-900 transition-all shadow-sm appearance-none uppercase tracking-widest text-[10px]"
                        >
                            <option value="all">Todas las Categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid of Product Cards for Employees (Cleaner than table for quick view) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => {
                        const isLowStock = product.stock <= 10;
                        const isOut = product.stock <= 0;
                        
                        return (
                            <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                                {isOut ? (
                                    <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-10">Agotado</div>
                                ) : isLowStock && (
                                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-10 animate-pulse">Stock Bajo</div>
                                )}
                                
                                <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 p-6 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50 transition-colors">
                                    {product.imagen_url ? (
                                        <img 
                                            src={getFileUrl(product.imagen_url)} 
                                            alt={product.nombre} 
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <ImageIcon className="text-slate-200 w-16 h-16" />
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">{product.categoria_nombre || 'Medicina'}</p>
                                        <h3 className="text-xl font-black text-slate-900 italic line-clamp-2 leading-tight">{product.nombre}</h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Existencia</span>
                                            <span className={`text-2xl font-black tracking-tighter ${isOut ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>{product.stock} <span className="text-[10px] text-slate-400 font-bold ml-1">UDS</span></span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Precio Publico</span>
                                            <span className="text-xl font-black text-indigo-600 tracking-tighter">${parseFloat(product.precio).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Barcode className="w-3 h-3 text-slate-400" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Código</span>
                                            </div>
                                            <p className="text-xs font-black text-slate-900 font-mono tracking-widest">{product.codigo_barras || 'SIN-CODE'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200 shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-sm">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 italic mb-2">Sin coincidencias</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">No encontramos productos que coincidan con tu búsqueda</p>
                    </div>
                )}
            </main>
        </StaffLayout>
    );
};

export default InventarioEmpleado;
