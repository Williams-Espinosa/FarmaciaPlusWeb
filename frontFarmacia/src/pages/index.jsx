import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Search, 
    ShoppingCart, 
    User, 
    Truck, 
    Clock, 
    ShieldCheck, 
    MapPin, 
    Menu, 
    X,
    ChevronRight,
    Heart,
    Plus,
    ArrowRight,
    FileText,
    Zap,
    Headphones
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="bg-white p-1.5 rounded-xl shadow-xl group-hover:scale-110 transition-transform">
                            <img src="/logo_v2.png" alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold tracking-tight">FarmaPlus</span>
                            <span className="text-[10px] font-medium text-blue-100 opacity-80 uppercase tracking-widest">Tu farmacia de confianza</span>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-bold">
                        <Link to="/" className="hover:text-blue-200 transition-colors">Inicio</Link>
                        <a href="#productos" className="hover:text-blue-200 transition-colors">Productos</a>
                        <Link to="/promociones" className="hover:text-blue-200 transition-colors">Promociones</Link>
                        <Link to="/servicios" className="hover:text-blue-200 transition-colors">Servicios</Link>
                        <Link to="/nosotros" className="hover:text-blue-200 transition-colors">Nosotros</Link>
                        <Link to="/blog" className="hover:text-blue-200 transition-colors">Blog</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">

                        <Link 
                            to="/register"
                            className="hidden md:flex items-center gap-2 text-white/90 hover:text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/10 transition"
                        >
                            <User className="w-4 h-4" />
                            Registrarse
                        </Link>
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

// Secciones de la página de inicio
const Hero = () => {
    return (
        <div className="bg-blue-600 py-16 lg:py-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
                            <span className="text-sm font-semibold flex items-center gap-2">
                                <span className="bg-yellow-400 w-2 h-2 rounded-full animate-pulse"></span>
                                Farmacia Certificada • Más de 10 años de experiencia
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                            Medicamentos a tu <span className="text-yellow-400">Puerta</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg">
                            Compra tus medicamentos y productos de farmacia desde la comodidad de tu hogar. 
                            <span className="font-bold text-white"> Envío rápido y seguro</span> a toda la ciudad.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/catalogo" className="bg-white text-blue-600 px-8 py-3.5 rounded-lg font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1 flex items-center gap-2">
                                Ver Productos <ChevronRight className="w-4 h-4" />
                            </Link>
                            <button className="bg-transparent border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white/10 transition">
                                Generar Pedido
                            </button>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex gap-8 pt-8 border-t border-white/20">
                            <div>
                                <p className="text-3xl font-bold text-yellow-400">500+</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Productos</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-yellow-400">10K+</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Clientes</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-yellow-400">24/7</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Servicio</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block animate-fade-in-right">
                        <div className="relative">
                            <img 
                                src="https://img.freepik.com/foto-gratis/farmaceutica-femenina-mascara-seguridad-que-trabaja-farmacia-comprobando-medicamentos-estantes_657921-686.jpg" 
                                alt="Farmacia" 
                                className="rounded-3xl shadow-2xl border-8 border-white/10"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Truck className="text-green-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Envío Gratis</p>
                                        <p className="text-sm font-bold text-gray-900">En el primer pedido</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoStrip = () => {
    return (
        <div className="bg-blue-700 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-blue-500/50">
                    <div className="flex items-center justify-center md:justify-start gap-6 px-4">
                        <Truck className="w-10 h-10 text-blue-300" />
                        <div>
                            <p className="font-bold text-lg">Envío Estándar</p>
                            <p className="text-blue-200 text-sm mt-0.5">$50 MXN | 24-48 hrs</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 px-4">
                        <div className="text-4xl font-bold text-blue-300">$</div>
                        <div>
                            <p className="font-bold text-lg">Envío Gratis</p>
                            <p className="text-blue-200 text-sm mt-0.5">En compras mayores a $500</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 px-4">
                        <MapPin className="w-10 h-10 text-blue-300" />
                        <div>
                            <p className="font-bold text-lg">Cobertura</p>
                            <p className="text-blue-200 text-sm mt-0.5">Toda la zona </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesPreview = () => {
    const services = [
        { icon: Truck, title: "Envío a Domicilio", color: "bg-blue-500", desc: "Entrega rápida y segura en menos de 24 horas." },
        { icon: FileText, title: "Recetas Médicas", color: "bg-green-500", desc: "Gestionamos tus recetas de manera profesional." },
        { icon: Headphones, title: "Atención 24/7", color: "bg-purple-500", desc: "Asesoría farmacéutica siempre disponible para ti." },
        { icon: Zap, title: "Servicio Express", color: "bg-red-500", desc: "Entregas en 60 min para tus urgencias médicas." }
    ];

    return (
        <div className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4 uppercase tracking-widest">
                            <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                            <span>Excelencia en Servicio</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                            Soluciones de Salud <br /> <span className="text-blue-600">A tu Medida</span>
                        </h2>
                    </div>
                    <Link to="/servicios" className="group flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                        Ver todos los servicios 
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                            <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                                <service.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{service.title}</h3>
                            <p className="text-gray-500 text-sm mb-8 font-medium leading-relaxed">{service.desc}</p>
                            <Link to="/servicios" className="text-sm font-bold text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                                Saber más <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative h-48 bg-gray-50 p-4 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-110 transition duration-300" />
            <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-red-500 cursor-pointer transition">
                <Heart className="w-4 h-4" />
            </div>
            {product.tag && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.tag}
                </span>
            )}
        </div>
        <div className="p-4">
            <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{product.category}</p>
            <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Stock: {product.stock} unidades</p>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    <span className="text-xs text-gray-400 ml-1">MXN</span>
                </div>
                <Link to="/login" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    <ShoppingCart className="w-5 h-5" />
                </Link>
            </div>
        </div>
    </div>
);

const ProductsSection = () => {
    const categories = ['Todos', 'Analgésicos', 'Antibióticos', 'Vitaminas', 'Higiene', 'Equipos Médicos'];
    const [activeTab, setActiveTab] = useState('Todos');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/productos');
                // Map backend fields to frontend expected format
                const mappedProducts = response.data.map(p => ({
                    id: p.id,
                    name: p.nombre,
                    category: p.categoria_nombre || 'Sin categoría', 
                    price: parseFloat(p.precio),
                    stock: p.stock,
                    image: p.imagen_url || 'https://via.placeholder.com/150', 
                    tag: p.requiere_receta ? 'Requiere Receta' : null
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Simple client-side filtering (mocking category behavior for now since DB lacks it)
    const filteredProducts = activeTab === 'Todos' 
        ? products 
        : products.filter(p => p.category === activeTab); 

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 id="productos" className="text-3xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
                    <p className="text-gray-600">Amplio catálogo de medicamentos y productos para el cuidado de tu salud</p>
                    
                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === cat 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(activeTab === 'Todos' ? products : filteredProducts).length > 0 ? (
                            (activeTab === 'Todos' ? products : filteredProducts).slice(0, 4).map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No se encontraron productos.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer = () => (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                    <ul className="space-y-2 text-sm text-slate-400">
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

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <InfoStrip />
            <ServicesPreview />
            <ProductsSection />
            <Footer />
        </div>
    );
}
