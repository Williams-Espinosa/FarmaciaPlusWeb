import React from 'react';
import { 
    Heart, 
    Users, 
    History, 
    Award, 
    ShieldCheck, 
    TrendingUp, 
    Stethoscope, 
    Truck, 
    CheckCircle2,
    Zap,
    Target,
    Eye,
    ChevronRight,
    Sparkles,
    Star,
    MapPin,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                        <Link to="/nosotros" className="text-blue-200 transition-colors font-black">Nosotros</Link>
                        <Link to="/blog" className="hover:text-blue-200 transition-colors">Blog</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link 
                            to="/login"
                            className="hidden md:flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition shadow-sm"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const StatCard = ({ icon: Icon, value, label, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
        <div className={`p-3 rounded-2xl ${colorClass} mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
);

const ValueCard = ({ icon: Icon, title, description, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-600 group">
        <div className={`p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:${colorClass} transition-colors`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    </div>
);

export default function Nosotros() {
    const stats = [
        { icon: Users, value: "10K+", label: "Clientes Satisfechos", colorClass: "bg-blue-50 text-blue-600" },
        { icon: History, value: "10+", label: "Años de Experiencia", colorClass: "bg-green-50 text-green-600" },
        { icon: TrendingUp, value: "500+", label: "Productos Disponibles", colorClass: "bg-purple-50 text-purple-600" },
        { icon: Heart, value: "99%", label: "Satisfacción Cliente", colorClass: "bg-red-50 text-red-600" }
    ];

    const values = [
        { icon: ShieldCheck, title: "Confianza", description: "Productos certificados y servicio transparente que garantiza tu tranquilidad.", colorClass: "text-blue-600" },
        { icon: Heart, title: "Compromiso", description: "Dedicados al bienestar de nuestros clientes con atención personalizada.", colorClass: "text-green-600" },
        { icon: Zap, title: "Eficiencia", description: "Entregas rápidas y procesos optimizados para tu comodidad.", colorClass: "text-purple-600" },
        { icon: Award, title: "Calidad", description: "Solo ofrecemos productos con registro sanitario y garantía de origen.", colorClass: "text-red-600" },
        { icon: Users, title: "Profesionalismo", description: "Personal capacitado y farmacéuticos certificados a tu servicio.", colorClass: "text-orange-600" },
        { icon: TrendingUp, title: "Innovación", description: "Tecnología y procesos modernos para brindarte la mejor experiencia.", colorClass: "text-indigo-600" }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header Section */}
            <div className="bg-gray-50 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Sobre Nosotros</h1>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                        Más de 10 años cuidando la salud de miles de familias mexicanas.
                    </p>
                </div>
            </div>

            {/* Main Content / History */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl">
                        <img 
                            src="https://img.freepik.com/foto-gratis/farmaceutica-femenina-mascara-seguridad-que-trabaja-farmacia-comprobando-medicamentos-estantes_657921-686.jpg" 
                            alt="FarmaPlus Historia" 
                            className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm tracking-wide">
                            <History className="w-4 h-4" />
                            Nuestra Historia
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                            Tu Salud, Nuestra Prioridad
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                FarmaPlus nació en 2015 con una misión clara: hacer que los medicamentos y productos de salud sean accesibles para todos los mexicanos. Lo que comenzó como una pequeña farmacia de barrio, hoy se ha convertido en una de las farmacias en línea más confiables del país.
                            </p>
                            <p>
                                Contamos con un equipo de farmacéuticos certificados, personal capacitado y un sistema de distribución eficiente que nos permite llevar tus medicamentos hasta la puerta de tu hogar en tiempo récord.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Certificados COFEPRIS</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Equipo Profesional</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Envíos Seguros</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-600 p-12 rounded-[3rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Target className="w-40 h-40" />
                        </div>
                        <div className="bg-white/20 p-3 rounded-2xl w-fit mb-8 shadow-inner">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black mb-6">Nuestra Misión</h3>
                        <p className="text-blue-50 leading-relaxed font-medium">
                            Proporcionar acceso rápido y confiable a medicamentos y productos de salud de calidad, garantizando la seguridad y bienestar de nuestros clientes a través de un servicio profesional, ético y comprometido con la excelencia.
                        </p>
                    </div>

                    <div className="bg-purple-600 p-12 rounded-[3rem] text-white shadow-xl shadow-purple-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Eye className="w-40 h-40" />
                        </div>
                        <div className="bg-white/20 p-3 rounded-2xl w-fit mb-8 shadow-inner">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black mb-6">Nuestra Visión</h3>
                        <p className="text-purple-50 leading-relaxed font-medium">
                            Ser la farmacia en línea líder en México, reconocida por nuestra innovación, calidad de servicio y compromiso con la salud de las familias mexicanas, expandiendo nuestro alcance a nivel nacional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Nuestros Valores</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <ValueCard key={index} {...value} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Team CTA */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                    <div className="max-w-2xl mx-auto relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-8">Nuestro Equipo</h2>
                        <p className="text-blue-50 text-lg mb-12 leading-relaxed font-medium">
                            Contamos con un equipo multidisciplinario de farmacéuticos, químicos y profesionales de la salud comprometidos con tu bienestar.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
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
