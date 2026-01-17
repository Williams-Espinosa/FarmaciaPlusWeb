import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationItem, setNotificationItem] = useState(null);

    // Quantity Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [tempQty, setTempQty] = useState(1);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + qty } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
        
        setNotificationItem(product);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const openAddModal = (product) => {
        setSelectedProduct(product);
        setTempQty(1);
        setShowModal(true);
    };

    const confirmAddToCart = () => {
        addToCart(selectedProduct, tempQty);
        setShowModal(false);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            openAddModal,
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            cartTotal, 
            cartCount,
            showNotification,
            notificationItem
        }}>
            {children}

            {/* Quantity Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
                    <div className="bg-white rounded-[3rem] p-10 w-full max-w-md relative z-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] p-4 flex items-center justify-center border border-slate-100">
                                    <img 
                                        src={`http://localhost:3000/${selectedProduct.imagen_url?.startsWith('/') ? selectedProduct.imagen_url.substring(1) : selectedProduct.imagen_url}`} 
                                        className="w-full h-full object-contain mix-blend-multiply" 
                                        alt=""
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Uniendo a tu carrito</p>
                                    <h3 className="font-black text-slate-900 text-xl leading-tight italic">{selectedProduct.nombre}</h3>
                                    <p className="text-sm font-black text-slate-400 mt-1">${selectedProduct.precio.toFixed(2)} c/u</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest text-center block">¿Cuántas piezas necesitas?</label>
                                <div className="flex items-center justify-center gap-6 bg-slate-50 rounded-3xl p-4 border border-slate-100 shadow-inner">
                                    <button 
                                        onClick={() => setTempQty(Math.max(1, tempQty - 1))}
                                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition active:scale-90"
                                    >
                                        <span className="text-2xl font-bold">−</span>
                                    </button>
                                    <span className="text-4xl font-black text-slate-900 w-16 text-center tabular-nums">{tempQty}</span>
                                    <button 
                                        onClick={() => setTempQty(tempQty + 1)}
                                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition active:scale-90"
                                    >
                                        <span className="text-2xl font-bold">+</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    onClick={confirmAddToCart}
                                    className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-4"
                                >
                                    ¡AGREGAR AL CARRITO! <span className="opacity-40 tracking-tighter">—</span> ${(selectedProduct.precio * tempQty).toFixed(2)}
                                </button>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition"
                                >
                                    Pensarlo mejor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Portal */}
            {showNotification && notificationItem && (
                <div className="fixed top-8 right-8 z-[9999] animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200 border border-slate-100 p-2 flex items-center gap-4 pr-8 min-w-[320px]">
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] p-2 flex items-center justify-center">
                            <img 
                                src={`http://localhost:3000/${notificationItem.imagen_url?.startsWith('/') ? notificationItem.imagen_url.substring(1) : notificationItem.imagen_url}`} 
                                alt="" 
                                className="w-full h-full object-contain mix-blend-multiply" 
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">¡Añadido con éxito!</p>
                            <h4 className="font-black text-slate-900 text-sm leading-tight line-clamp-1">{notificationItem.nombre}</h4>
                        </div>
                        <div className="ml-auto bg-emerald-100 p-2 rounded-full">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
