import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';
import { 
    Package, Search, Filter, Plus, Edit2, 
    Trash2, AlertTriangle, CheckCircle2, 
    X, ImageIcon, Barcode, DollarSign, 
    Hash, Tag, ShieldAlert, MoreVertical
} from 'lucide-react';
import api, { getFileUrl } from '../../services/api';

const Inventario = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    
    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        codigo_barras: '',
        categoria_id: '',
        requiere_receta: 0,
        imagen: null
    });

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

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            codigo_barras: '',
            categoria_id: '',
            requiere_receta: 0,
            imagen: null
        });
        setSelectedProduct(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            stock: product.stock,
            codigo_barras: product.codigo_barras,
            categoria_id: product.categoria_id,
            requiere_receta: product.requiere_receta,
            imagen: null // Image is handled separately if changed
        });
        setIsEditModalOpen(true);
    };

    const handleOpenDelete = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e, mode) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'imagen') {
                if (formData.imagen) data.append('imagen', formData.imagen);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            if (mode === 'add') {
                await api.post('/productos', data);
            } else {
                await api.put(`/productos/${selectedProduct.id}`, data);
            }
            fetchData();
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error saving product:', error);
            const msg = error.response?.data?.error || 'Error al guardar el producto.';
            alert(msg);
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/productos/${selectedProduct.id}`);
            fetchData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto.');
        }
    };

    if (loading) {
        return <LoadingScreen message="Sincronizando inventario global..." />;
    }

    return (
        <AdminLayout title="Control de Inventario">
            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventario Maestro</h1>
                        <p className="text-slate-500 font-bold mt-1">Gestión centralizada de productos y existencias.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleOpenAdd}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
                        >
                            <Plus className="w-5 h-5" /> Registrar Producto
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o código de barras..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Filter className="w-5 h-5" />
                        </div>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-14 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all shadow-sm appearance-none"
                        >
                            <option value="all">Todas las Categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm px-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total SKU</p>
                                <p className="text-lg font-black text-slate-900 leading-none">{products.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Producto Info</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Categoría</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Precio (MXN)</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Existencias</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Estado</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {product.imagen_url ? (
                                                        <img 
                                                            src={getFileUrl(product.imagen_url)} 
                                                            alt={product.nombre} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{product.nombre}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Barcode className="w-3 h-3 text-slate-400" />
                                                        <code className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{product.codigo_barras || 'SIN-CÓDIGO'}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider ring-1 ring-indigo-100">
                                                {product.categoria_nombre || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900">${parseFloat(product.precio).toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-black ${product.stock <= 10 ? 'text-red-600' : 'text-slate-900'}`}>
                                                    {product.stock}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">uds</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {product.stock <= 0 ? (
                                                <span className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                                    <X className="w-4 h-4 bg-red-100 rounded-full p-0.5" /> Agotado
                                                </span>
                                            ) : product.stock <= 10 ? (
                                                <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                                    <AlertTriangle className="w-4 h-4 bg-amber-100 rounded-full p-0.5" /> Stock Bajo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" /> Saludable
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm group/btn"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDelete(product)}
                                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                                                    <Search className="w-8 h-8" />
                                                </div>
                                                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No se encontraron productos</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal: Crear / Editar Producto */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                        onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                    ></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    {isAddModalOpen ? <Plus className="w-8 h-8 text-indigo-600" /> : <Edit2 className="w-8 h-8 text-indigo-600" />}
                                    {isAddModalOpen ? 'Nuevo Producto' : 'Actualizar Producto'}
                                </h2>
                                <p className="text-slate-500 font-bold text-sm mt-1">Completa la ficha técnica del medicamento.</p>
                            </div>
                            <button 
                                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                className="p-2 hover:bg-slate-100 rounded-xl transition"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e, isAddModalOpen ? 'add' : 'edit')} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Nombre Comercial</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            placeholder="Ej. Paracetamol 500mg Forte"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Categoría</label>
                                    <select 
                                        required
                                        value={formData.categoria_id}
                                        onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all appearance-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Código de Barras</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                            <Barcode className="w-5 h-5" />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.codigo_barras}
                                            onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})}
                                            placeholder="EAN-13, UPC..."
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Precio Unitario ($)</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <input 
                                            required
                                            type="number" 
                                            step="0.01"
                                            value={formData.precio}
                                            onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                            placeholder="0.00"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Existencias Iniciales</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <input 
                                            required
                                            type="number" 
                                            value={formData.stock}
                                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                            placeholder="0"
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Descripción / Indicaciones</label>
                                    <textarea 
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                        rows="3"
                                        placeholder="Uso, contraindicaciones, etc."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-3">Imagen del Producto</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center relative group overflow-hidden">
                                            {formData.imagen ? (
                                                <img src={URL.createObjectURL(formData.imagen)} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-slate-300 w-8 h-8" />
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer">
                                            <div className="bg-slate-50 border border-slate-100 hover:border-indigo-500/30 hover:bg-slate-100 transition-all rounded-2xl p-6 text-center group">
                                                <p className="text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Haz clic para subir imagen</p>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e) => setFormData({...formData, imagen: e.target.files[0]})}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.requiere_receta === 1}
                                            onChange={(e) => setFormData({...formData, requiere_receta: e.target.checked ? 1 : 0})}
                                            className="w-6 h-6 rounded-lg border-slate-200 text-red-600 focus:ring-red-500 transition-all"
                                        />
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-red-500" />
                                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Requiere Receta Médica</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest">
                                {isAddModalOpen ? 'Registrar en Inventario' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Confirmación Eliminación */}
            {isDeleteModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">¿Eliminar Producto?</h3>
                        <p className="text-slate-500 font-bold mb-8">
                            Estás a punto de borrar <span className="text-red-500">{selectedProduct.nombre}</span>. Esta acción es definitiva.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition active:scale-95 shadow-xl shadow-red-100 uppercase tracking-widest"
                            >
                                SÍ, ELIMINAR AHORA
                            </button>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition active:scale-95 uppercase tracking-widest"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Inventario;
