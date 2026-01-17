import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    ShoppingCart,
    Clock,
    Zap,
    Tag,
    ChevronRight,
    Sparkles,
    MapPin
} from 'lucide-react';



// Navbar Component
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
                        <Link to="/promociones" className="text-yellow-300 transition-colors">Promociones</Link>
                        <Link to="/servicios" className="hover:text-blue-200 transition-colors">Servicios</Link>
                        <Link to="/nosotros" className="hover:text-blue-200 transition-colors">Nosotros</Link>
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

// Countdown Timer Component
const CountdownTimer = ({ endDate, variant = 'default' }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endDate) - new Date();
        if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };
        
        return {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (variant === 'small') {
        return (
            <span className="text-sm text-gray-500">
                Termina en {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
        );
    }

    return (
        <div className="flex gap-3">
            {[
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Minutos' },
                { value: timeLeft.seconds, label: 'Segundos' }
            ].map((item, i) => (
                <div key={i} className="bg-white px-4 py-3 rounded-xl text-center shadow-sm min-w-[70px]">
                    <div className="text-2xl font-bold text-gray-900">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

// Promo Product Card
const PromoProductCard = ({ product, variant = 'default' }) => {
    const savings = product.originalPrice - product.price;
    const discountPercent = product.originalPrice > 0 ? Math.round((savings / product.originalPrice) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full object-contain group-hover:scale-110 transition duration-300" 
                />
                
                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        -{discountPercent}%
                    </div>
                )}
                
                {/* Tag Badge */}
                {product.tag && (
                    <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                        product.tag === 'Oferta Limitada' ? 'bg-orange-500' :
                        product.tag === '2x1' ? 'bg-green-500' :
                        product.tag === 'Combo' ? 'bg-purple-500' :
                        product.tag === 'Pack Ahorro' ? 'bg-blue-500' :
                        'bg-pink-500'
                    }`}>
                        {product.tag}
                    </span>
                )}
                
                {/* Stock Badge */}
                {product.stock <= 20 && (
                    <span className="absolute bottom-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Solo {product.stock} unidades
                    </span>
                )}
            </div>
            
            {/* Content Section */}
            <div className="p-4">
                <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Solo quedan {product.stock} unidades</p>
                
                {/* Price Section */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Ahorras ${savings}
                    </span>
                </div>
                
                {/* Add to Cart Button */}
                <Link 
                    to="/login"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {variant === 'flash' ? 'Comprar Ahora' : 'Agregar al Carrito'}
                </Link>
            </div>
        </div>
    );
};

// Flash Sale Card (horizontal)
const FlashSaleCard = ({ product }) => {
    const savings = product.originalPrice - product.price;
    const discountPercent = product.originalPrice > 0 ? Math.round((savings / product.originalPrice) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
            {/* Discount Badge */}
            <div className="relative">
                {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                        -{discountPercent}%
                    </div>
                )}
                {product.stock <= 20 && (
                    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full z-10">
                        Solo {product.stock} unidades
                    </div>
                )}
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <img src={product.image} alt={product.name} className="h-full object-contain" />
                </div>
            </div>
            
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                </div>
                <Link 
                    to="/login"
                    className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Comprar Ahora
                </Link>
            </div>
        </div>
    );
};

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

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
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">¿No quieres perderte ninguna oferta?</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
                Suscríbete a nuestro newsletter y recibe las mejores promociones directamente en tu correo.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                    required
                />
                <button 
                    type="submit"
                    disabled={submitting}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
                >
                    {submitting ? 'Enviando...' : 'Suscribirme'}
                </button>
            </form>
            {status.message && (
                <p className={`text-sm mt-4 font-bold ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                    {status.message}
                </p>
            )}
        </section>
    );
};

export default function Promociones() {
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [allPromotions, setAllPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    // End dates for timers
    const megaOfferEnd = new Date();
    megaOfferEnd.setHours(megaOfferEnd.getHours() + 5);
    megaOfferEnd.setMinutes(megaOfferEnd.getMinutes() + 30);
    
    const flashSaleEnd = new Date();
    flashSaleEnd.setHours(flashSaleEnd.getHours() + 2);
    flashSaleEnd.setMinutes(flashSaleEnd.getMinutes() + 30);

    useEffect(() => {
        const fetchPromociones = async () => {
            try {
                const response = await api.get('/promociones/activas');
                const data = response.data;

                // Map database promotions to frontend format
                const mappedPromos = data.map(p => {
                    const originalPrice = parseFloat(p.producto_precio) || 0;
                    let price = originalPrice;
                    let tag = p.tipo === '2x1' ? '2x1' : 
                            p.tipo === 'combo' ? 'Combo' : 
                            p.tipo === 'precio_fijo' ? 'Oferta' : 'Descuento';
                    
                    if (p.tipo === 'porcentaje') {
                        price = originalPrice * (1 - parseFloat(p.descuento) / 100);
                        tag = `-${Math.round(p.descuento)}%`;
                    } else if (p.tipo === 'precio_fijo') {
                        price = parseFloat(p.descuento);
                    }

                    return {
                        id: p.id,
                        name: p.titulo || p.producto_nombre,
                        category: p.categoria_nombre || 'General',
                        originalPrice: Math.round(originalPrice),
                        price: Math.round(price),
                        stock: p.producto_stock || 0,
                        image: p.imagen_url || p.producto_imagen || 'https://via.placeholder.com/300',
                        tag: tag,
                        isFlash: p.tipo === 'porcentaje' && p.descuento >= 30 // Example logic for flash sales
                    };
                });

                setFlashSaleProducts(mappedPromos.filter(p => p.isFlash).slice(0, 3));
                setAllPromotions(mappedPromos);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromociones();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 py-12 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4" />
                        ¡Ofertas Increíbles!
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Promociones Especiales</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        Aprovecha nuestras ofertas exclusivas y ahorra en tus productos favoritos
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Mega Offer Banner */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 md:p-12 text-white">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                                    <Clock className="w-4 h-4" />
                                    Promoción Destacada
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">Mega Oferta del Mes</h2>
                                <p className="text-lg opacity-90 mb-6">Aprovecha hasta 50% de descuento en productos seleccionados</p>
                                
                                <div className="mb-6">
                                    <p className="text-sm opacity-80 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Termina en:
                                    </p>
                                    <CountdownTimer endDate={megaOfferEnd} />
                                </div>
                                

                            </div>
                            
                            <div className="relative hidden md:block">
                                <img 
                                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" 
                                    alt="Mega Oferta" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                                    <div className="text-center">
                                        <span className="text-2xl font-bold">-50</span>
                                        <span className="text-lg font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flash Sales Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Ofertas Relámpago</h2>
                        </div>
                        <div className="flex items-center gap-2 text-red-500">
                            <Clock className="w-5 h-5" />
                            <CountdownTimer endDate={flashSaleEnd} variant="small" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {flashSaleProducts.map(product => (
                            <FlashSaleCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* All Promotions Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Tag className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Todas las Promociones</h2>
                        </div>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            Ahorra hasta 50%
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allPromotions.length > 0 ? (
                            allPromotions.map(product => (
                                <PromoProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 font-medium">No hay promociones disponibles en este momento.</p>
                                <p className="text-sm text-gray-400">Vuelve pronto para ver nuestras nuevas ofertas.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter Section */}
                <NewsletterSection />
            </div>

            {/* Footer */}
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
        </div>
    );
}
