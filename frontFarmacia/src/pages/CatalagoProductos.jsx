import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Search, 
    ShoppingCart, 
    User, 
    Heart,
    CheckCircle,
    X,
    Filter,
    ChevronDown,
    MapPin,
    Clock
} from 'lucide-react';

// Navbar Component
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-white p-1 rounded-lg">
                            <img src="/logo_v2.png" alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FarmaPlus</span>
                    </div>

                    <div className="hidden md:flex space-x-8 text-sm font-medium">
                        <Link to="/" className="hover:text-blue-100 transition">Inicio</Link>
                        <Link to="/catalogo" className="hover:text-blue-100 transition text-yellow-300">Catálogo</Link>
                        <Link to="/promociones" className="hover:text-blue-100 transition">Promociones</Link>
                    </div>

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

// Product Card Component
const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
            <img 
                src={product.image} 
                alt={product.name} 
                className="h-full object-contain group-hover:scale-110 transition duration-300" 
            />
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:text-red-500 hover:scale-110 cursor-pointer transition-all">
                <Heart className="w-4 h-4" />
            </button>
            {product.tag && (
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.tag}
                </span>
            )}
        </div>
        <div className="p-5">
            <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{product.category}</p>
            <h3 className="font-bold text-gray-900 mb-1 truncate text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Stock: {product.stock} unidades</p>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                    <span className="text-xs text-gray-400 ml-1">MXN</span>
                </div>
                <Link to="/login" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 hover:scale-105">
                    <ShoppingCart className="w-5 h-5" />
                </Link>
            </div>
        </div>
    </div>
);

// Main Catalog Component
export default function CatalagoProductos() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [prescriptionFilter, setPrescriptionFilter] = useState('todos'); // todos, si, no
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias')
                ]);
                
                const mappedProducts = productsRes.data.map(p => ({
                    id: p.id,
                    name: p.nombre,
                    category: p.categoria_nombre || 'Sin categoría',
                    price: parseFloat(p.precio),
                    stock: p.stock,
                    image: p.imagen_url || 'https://via.placeholder.com/150',
                    tag: (p.requiere_receta === 1 || p.requiere_receta === true) ? 'Requiere Receta' : null,
                    requiresPrescription: p.requiere_receta === 1 || p.requiere_receta === true
                }));
                
                setProducts(mappedProducts);
                
                // Calculate max price for slider
                if (mappedProducts.length > 0) {
                    const max = Math.max(...mappedProducts.map(p => p.price));
                    setMaxPrice(Math.ceil(max / 100) * 100); // Round up to nearest 100
                    setPriceRange([0, Math.ceil(max / 100) * 100]);
                }
                
                // Set categories from API
                const cats = categoriesRes.data.map(c => c.nombre);
                setCategories(['Todos', ...cats]);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products
    const filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        
        // Price filter
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        
        // Prescription filter
        let matchesPrescription = true;
        if (prescriptionFilter === 'si') {
            matchesPrescription = product.requiresPrescription;
        } else if (prescriptionFilter === 'no') {
            matchesPrescription = !product.requiresPrescription;
        }
        
        return matchesSearch && matchesCategory && matchesPrice && matchesPrescription;
    });

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('Todos');
        setPriceRange([0, maxPrice]);
        setPrescriptionFilter('todos');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-3">Catálogo de Productos</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        Descubre nuestra amplia selección de medicamentos y productos para el cuidado de tu salud.
                        <br />Todos nuestros productos cuentan con registro sanitario vigente.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar medicamento o equipo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile filter button */}
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 mb-4"
                >
                    <Filter className="w-4 h-4" />
                    Filtros
                    <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-bold text-gray-900">Filtros</h3>
                                </div>
                                <button 
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Limpiar
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Categoría</h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label 
                                            key={cat} 
                                            className="flex items-center gap-3 cursor-pointer group"
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                selectedCategory === cat 
                                                    ? 'border-blue-600 bg-blue-600' 
                                                    : 'border-gray-300 group-hover:border-blue-400'
                                            }`}>
                                                {selectedCategory === cat && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span className={`text-sm ${
                                                selectedCategory === cat ? 'text-blue-600 font-medium' : 'text-gray-600'
                                            }`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Rango de Precio</h4>
                                <div className="px-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Prescription Filter */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">Requiere Receta</h4>
                                <div className="space-y-2">
                                    {[
                                        { value: 'todos', label: 'Todos' },
                                        { value: 'si', label: 'Sí requiere' },
                                        { value: 'no', label: 'No requiere' }
                                    ].map((option) => (
                                        <label 
                                            key={option.value} 
                                            className="flex items-center gap-3 cursor-pointer group"
                                            onClick={() => setPrescriptionFilter(option.value)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                prescriptionFilter === option.value 
                                                    ? 'border-blue-600 bg-blue-600' 
                                                    : 'border-gray-300 group-hover:border-blue-400'
                                            }`}>
                                                {prescriptionFilter === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span className={`text-sm ${
                                                prescriptionFilter === option.value ? 'text-blue-600 font-medium' : 'text-gray-600'
                                            }`}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Results count */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Mostrando <span className="font-bold text-blue-600">{filteredProducts.length}</span> productos
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
                                <p className="text-gray-500 mb-4">Intenta ajustar los filtros o buscar con otros términos</p>
                                <button 
                                    onClick={clearFilters}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </main>
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
