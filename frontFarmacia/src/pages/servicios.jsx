import React from 'react';
import { 
    Truck, 
    FileText, 
    Headphones, 
    Zap, 
    ShieldCheck, 
    Package,
    Heart,
    ChevronRight,
    ArrowRight,
    Search,
    CheckCircle2,
    Star,
    Sparkles,
    MapPin,
    Clock,
    User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
                        <Link to="/servicios" className="text-blue-200 transition-colors font-black">Servicios</Link>
                        <Link to="/nosotros" className="hover:text-blue-200 transition-colors">Nosotros</Link>
                        <Link to="/blog" className="hover:text-blue-200 transition-colors">Blog</Link>
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

const ServiceCard = ({ icon: Icon, title, description, benefits, colorClass, delay }) => (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden animate-fade-in-up ${delay}`}>
        <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`}></div>
        
        <div className={`${colorClass} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
            <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-500 leading-relaxed mb-6 font-medium">{description}</p>
        
        <ul className="space-y-3 mb-8">
            {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {benefit}
                </li>
            ))}
        </ul>

        
    </div>
);

export default function Servicios() {
    const services = [
        {
            icon: Truck,
            title: "Envío a Domicilio",
            description: "Llevamos tus medicamentos hasta la puerta de tu hogar con la mayor rapidez y seguridad.",
            benefits: ["Entrega en menos de 24h", "Seguimiento en tiempo real", "Envío gratis en compras > $500"],
            colorClass: "bg-blue-500",
            delay: "delay-0"
        },
        {
            icon: FileText,
            title: "Recetas Médicas",
            description: "Gestionamos tus recetas digitales y físicas de manera eficiente y profesional.",
            benefits: ["Validación inmediata", "Surtido completo", "Recordatorios de resurtido"],
            colorClass: "bg-green-500",
            delay: "delay-100"
        },
        {
            icon: Headphones,
            title: "Atención al Cliente",
            description: "Nuestro equipo de farmacéuticos está disponible para resolver todas tus dudas.",
            benefits: ["Asesoría profesional", "Chat en vivo 24/7", "Atención personalizada"],
            colorClass: "bg-purple-500",
            delay: "delay-200"
        },
        {
            icon: Zap,
            title: "Servicio Express",
            description: "Para esas urgencias que no pueden esperar, tenemos el servicio más rápido de la ciudad.",
            benefits: ["Entrega en 60 minutos", "Prioridad máxima", "Cobertura ampliada"],
            colorClass: "bg-red-500",
            delay: "delay-300"
        },
        {
            icon: ShieldCheck,
            title: "Asesoría Farmacéutica",
            description: "Consultas gratuitas sobre el uso correcto de tus medicamentos y efectos secundarios.",
            benefits: ["Farmacéuticos titulados", "Interacciones medicamentosas", "Guía de administración"],
            colorClass: "bg-indigo-500",
            delay: "delay-400"
        },
        {
            icon: Star,
            title: "Programa de Lealtad",
            description: "Obtén beneficios exclusivos, descuentos y puntos por cada compra que realices.",
            benefits: ["Puntos acumulables", "Ofertas exclusivas", "Regalo en tu cumpleaños"],
            colorClass: "bg-yellow-500",
            delay: "delay-500"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-blue-600 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-8 border border-white/30 animate-fade-in-down">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        Servicios de Clase Mundial
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight animate-fade-in-up">
                        Cuidamos de ti con <br /> <span className="text-yellow-400">Excelencia y Rapidez</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
                        Descubre cómo nuestras soluciones integrales de salud están transformando la manera en que cuidas de ti y de tu familia.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>

            {/* How it Works Section */}
            <div className="bg-white py-24 mb-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">¿Cómo Funciona?</h2>
                        <p className="text-gray-500 font-bold max-w-xl mx-auto">Tu salud en tres sencillos pasos desde la comodidad de tu hogar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: "01", title: "Busca tu Producto", desc: "Utiliza nuestro buscador inteligente para encontrar lo que necesitas." },
                            { step: "02", title: "Sube tu Receta", desc: "Si es necesario, carga una foto de tu receta médica de forma segura." },
                            { step: "03", title: "Recibe en Casa", desc: "Relájate mientras nuestro equipo lleva tu pedido hasta tu puerta." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative group p-8 rounded-3xl hover:bg-slate-50 transition-colors duration-500">
                                <span className="text-7xl font-black text-blue-50 absolute -top-4 left-4 group-hover:text-blue-100 transition-colors">{item.step}</span>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 py-20 pb-32">
                <div className="bg-gray-900 rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                    <div className="max-w-2xl mx-auto relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">¿Listo para experimentar el <br /> <span className="text-blue-500">Mejor Servicio?</span></h2>
                        <p className="text-gray-400 text-lg mb-12 font-medium">Únete a miles de clientes que confían su salud en nuestras manos. Regístrate hoy y obtén beneficios exclusivos.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transform hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                                Crear una Cuenta
                            </Link>
                            <Link to="/catalogo" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all">
                                Explorar Catálogo
                            </Link>
                        </div>
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
