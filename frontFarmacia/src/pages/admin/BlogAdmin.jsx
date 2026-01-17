import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Plus, 
    Edit2, 
    Trash2, 
    Image as ImageIcon, 
    Star, 
    Search, 
    X, 
    AlertTriangle,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getFileUrl } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/common/LoadingScreen';

const BlogAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        destacado: false,
        imagen: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const startTime = Date.now();
        try {
            setLoading(true);
            const postsRes = await api.get('/blogs');
            setPosts(postsRes.data);
        } catch (err) {
            console.error('Error fetching blog data:', err);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 800 - elapsedTime);
            setTimeout(() => setLoading(false), remainingTime);
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                titulo: post.titulo,
                descripcion: post.descripcion,
                destacado: post.destacado,
                imagen: null
            });
            setPreviewUrl(getFileUrl(post.imagen_url));
        } else {
            setEditingPost(null);
            setFormData({
                titulo: '',
                descripcion: '',
                destacado: false,
                imagen: null
            });
            setPreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imagen: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('titulo', formData.titulo);
            data.append('descripcion', formData.descripcion);
            data.append('destacado', formData.destacado);
            if (formData.imagen) {
                data.append('imagen', formData.imagen);
            }

            if (editingPost) {
                await api.put(`/blogs/${editingPost.id}`, data);
            } else {
                await api.post('/blogs', data);
            }
            
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving post:', err);
            alert('Error al guardar el artículo.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/blogs/${postToDelete.id}`);
            setIsDeleting(false);
            setPostToDelete(null);
            fetchData();
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('No se pudo eliminar el artículo.');
            setIsDeleting(false);
        }
    };

    const toggleDestacado = async (post) => {
        try {
            const data = new FormData();
            data.append('destacado', !post.destacado);
            await api.put(`/blogs/${post.id}`, data);
            fetchData();
        } catch (err) {
            console.error('Error toggling destacado:', err);
        }
    };

    const filteredPosts = posts.filter(post => 
        post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !posts.length) {
        return <LoadingScreen message="Cargando redacción y artículos..." />;
    }

    return (
        <AdminLayout title="Gestión de Blog">
            <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Artículos del Blog</h1>
                        <p className="text-slate-500 font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Gestiona el contenido informativo de la empresa
                        </p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> NUEVO ARTÍCULO
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por título o contenido..." 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Mostrando {filteredPosts.length} de {posts.length} artículos
                    </div>
                </div>

                {/* Blog Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Post</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Publicación</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {post.imagen_url ? (
                                                        <img src={getFileUrl(post.imagen_url)} alt={post.titulo} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 line-clamp-1">{post.titulo}</p>
                                                    <p className="text-xs text-slate-500 font-bold line-clamp-1 mt-0.5">{post.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <button 
                                                onClick={() => toggleDestacado(post)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[10px] tracking-tight uppercase transition-all ${
                                                    post.destacado 
                                                        ? 'bg-yellow-50 text-yellow-600 border-yellow-200' 
                                                        : 'bg-slate-50 text-slate-400 border-slate-200'
                                                }`}
                                            >
                                                <Star className={`w-3 h-3 ${post.destacado ? 'fill-yellow-600' : ''}`} />
                                                {post.destacado ? 'DESTACADO' : 'NORMAL'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-slate-500 text-nowrap">
                                                {post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'S/F'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(post)}
                                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setPostToDelete(post);
                                                        setIsDeleting(true);
                                                    }}
                                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-8 sm:p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 p-3 rounded-2xl text-white">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">{editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Título del Post</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                    placeholder="Ej. Consejos para una vida saludable..."
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contenido / Descripción</label>
                                <textarea 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 min-h-[150px]"
                                    placeholder="Escribe aquí el contenido principal del artículo..."
                                    required
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Imagen de Portada</label>
                                    <div className="relative group">
                                        <div className={`w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden bg-slate-50 group-hover:bg-slate-100 transition-all ${previewUrl ? 'border-blue-500' : ''}`}>
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                                                    <p className="text-xs font-black text-slate-400">Click para subir imagen</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black text-blue-900">Artículo Destacado</p>
                                            <p className="text-[10px] text-blue-600 font-bold uppercase">Aparecerá en el inicio</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, destacado: !formData.destacado})}
                                            className={`w-12 h-6 rounded-full transition-all relative ${formData.destacado ? 'bg-blue-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.destacado ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                                    disabled={saving}
                                >
                                    CANCELAR
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    disabled={saving}
                                >
                                    {saving ? 'GUARDANDO...' : (editingPost ? 'ACTUALIZAR POST' : 'PUBLICAR AHORA')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && postToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleting(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">¿Estás seguro?</h3>
                        <p className="text-slate-500 font-bold mb-8">Esta acción eliminará permanentemente el artículo "{postToDelete.titulo}".</p>
                        <div className="space-y-3">
                            <button 
                                onClick={handleDelete}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition shadow-xl shadow-red-100 active:scale-95"
                            >
                                SÍ, ELIMINAR AHORA
                            </button>
                            <button 
                                onClick={() => setIsDeleting(false)}
                                className="w-full py-4 text-slate-400 font-black text-xs hover:text-slate-600 transition"
                            >
                                CANCELAR ACCIÓN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BlogAdmin;
