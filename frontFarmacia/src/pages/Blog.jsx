import React from 'react';
import { 
    BookOpen, 
    Calendar, 
    ArrowRight, 
    Search,
    Mail,
    ChevronRight,
    ShoppingCart,
    Heart,
    Star,
    Sparkles,
    MapPin,
    Clock,
    User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getFileUrl } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 cursor-pointer group">
                        <div className="bg-white p-1.5 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                            <img src="/logo_v2.png" alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold tracking-tight">FarmaPlus</span>
                            <span className="text-[10px] font-medium text-blue-100 opacity-80 uppercase tracking-widest">Tu farmacia de confianza</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-bold">
                        <Link to="/" className="hover:text-blue-200 transition-colors">Inicio</Link>
                        <Link to="/catalogo" className="hover:text-blue-200 transition-colors">Productos</Link>
                        <Link to="/promociones" className="hover:text-blue-200 transition-colors">Promociones</Link>
                        <Link to="/servicios" className="hover:text-blue-200 transition-colors">Servicios</Link>
                        <Link to="/nosotros" className="hover:text-blue-200 transition-colors">Nosotros</Link>
                        <Link to="/blog" className="text-blue-200 transition-colors font-black">Blog</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="hidden md:flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition shadow-sm"
                        >
                            <User className="w-4 h-4" />
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const BlogCard = ({ image, date, author, title, summary, category, delay }) => (
    <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full animate-fade-in-up ${delay}`}>
        <div className="relative h-64 overflow-hidden">
            <img
                src={image || "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&w=800&q=80"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-6 left-6">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {category}
                </span>
            </div>
        </div>

        <div className="p-8 flex flex-col flex-grow">
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {date}
                </div>
                <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    {author}
                </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                {title}
            </h3>

            <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                {summary}
            </p>

            
        </div>
    </div>
);

export default function Blog() {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [status, setStatus] = React.useState({ type: '', message: '' });

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/blogs');
                const mappedPosts = response.data.map((post, index) => ({
                    image: getFileUrl(post.imagen_url),
                    date: post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente',
                    author: "FarmaPlus Staff",
                    category: post.destacado ? "Destacado" : "Salud",
                    title: post.titulo,
                    summary: post.descripcion,
                    delay: `delay-${index * 100}`
                }));
                setPosts(mappedPosts);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/newsletter/suscribir', { email });
            setStatus({ type: 'success', message: '¡Gracias por suscribirte!' });
            setEmail('');
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Hubo un error al suscribirte.' 
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full text-blue-400 text-sm font-bold mb-8 border border-blue-500/30">
                        <BookOpen className="w-4 h-4" />
                        Blog de Salud y Bienestar
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                        Tu Fuente Confiable de <br /> <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Consejos y Salud</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                        Artículos expertos diseñados para ayudarte a tomar mejores decisiones para tu salud y la de tu familia.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar artículos..."
                            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Featured Section / Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 mb-24">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <BlogCard key={index} {...post} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] shadow-sm">
                                <p className="text-gray-500">No hay artículos disponibles en este momento.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Newsletter Subscription */}
            <div className="max-w-7xl mx-auto px-4 py-24 pb-32">
                <div className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="lg:w-1/2 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Suscríbete a Nuestro <br /> <span className="text-blue-600">Newsletter</span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium">Recibe los últimos artículos de salud y ofertas exclusivas directamente en tu bandeja de entrada.</p>
                    </div>

                    <div className="lg:w-1/2 w-full relative z-10">
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Tu correo electrónico"
                                className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                                required
                            />
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transform hover:scale-105 transition-all shadow-xl shadow-blue-500/20 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Enviando...' : 'Suscribirse'}
                            </button>
                        </form>
                        {status.message && (
                            <p className={`text-sm mt-4 text-center lg:text-left font-bold ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {status.message}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-4 text-center lg:text-left font-medium">Respetamos tu privacidad. Puedes darte de baja en cualquier momento.</p>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}

const Footer = () => (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                <div>
                    <h3 className="text-xl font-bold mb-4">FarmaPlus</h3>
                    <p className="text-slate-400 text-sm">
                        Tu farmacia de confianza con servicio a domicilio.
                        Cuidamos de tu salud y bienestar.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
                    <ul className="space-y-2 text-sm text-slate-400 font-medium">
                        <li><Link to="/nosotros" className="hover:text-white transition">Sobre Nosotros</Link></li>
                        <li><Link to="/catalogo" className="hover:text-white transition">Catálogo de Productos</Link></li>
                        <li><Link to="/promociones" className="hover:text-white transition">Promociones</Link></li>
                        <li><Link to="/blog" className="hover:text-white transition">Blog de Salud</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-400 font-medium">
                        <li><Link to="/legal/terminos" className="hover:text-white transition">Términos y Condiciones</Link></li>
                        <li><Link to="/legal/privacidad" className="hover:text-white transition">Política de Privacidad</Link></li>
                        <li><Link to="/legal/envio" className="hover:text-white transition">Políticas de Envío</Link></li>
                        <li><Link to="/legal/devoluciones" className="hover:text-white transition">Política de Devoluciones</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Contacto</h4>
                    <ul className="space-y-4 text-sm text-slate-400 font-medium">
                        <li className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-blue-500" /> +52 (966) 664 29 31
                        </li>
                        <li className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-blue-500" /> Lun - Sáb: 8:00 - 22:00
                        </li>
                        <li className="flex items-start gap-2">
                             <MapPin className="w-4 h-4 mt-1 text-blue-500" /> Av. Principal #123 <br/> Col. Centro, CDMX
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                <p>&copy; 2025 FarmaPlus. Todos los derechos reservados.</p>
                <p>Registro Sanitario: COFEPRIS-12345-2025</p>
            </div>
        </div>
    </footer>
);
