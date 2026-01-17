import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Loader2, ArrowLeft, Navigation } from 'lucide-react';
import api from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Registrar = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    rol: 3,
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Function to get current location and convert to address
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible en tu navegador.');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding API to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              direccion: data.display_name,
            }));
          } else {
            // Fallback: use coordinates if address not found
            setFormData((prev) => ({
              ...prev,
              direccion: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
            }));
          }
        } catch (err) {
          console.error('Error getting address:', err);
          setFormData((prev) => ({
            ...prev,
            direccion: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado. Habilita el acceso a tu ubicación.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Información de ubicación no disponible.');
            break;
          case err.TIMEOUT:
            setError('La solicitud de ubicación tardó demasiado.');
            break;
          default:
            setError('');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.telefono.length < 10) {
        setError('El número de teléfono debe tener al menos 10 dígitos.');
        setLoading(false);
        return;
    }

    try {
      await api.post('/usuarios/registro', formData);
      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error al crear la cuenta. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGIN/REGISTRO CON GOOGLE
  // ======================
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Validar con el backend (mismo flujo que login)
        const res = await api.post('/usuarios/login', {
            email: user.email,
            nombre: user.displayName,
            isGoogle: true // Bandera para que el backend sepa que es Google
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const rol = res.data.user.rol;
        
        // Redirección robusta (Soporta ID 1,2,3 o strings)
        if (rol === 1 || rol === 'admin') navigate('/admin/perfil');
        else if (rol === 2 || rol === 'empleado') navigate('/empleado/perfil');
        else if (rol === 3 || rol === 'cliente') navigate('/cliente/perfil');
        else navigate('/');

    } catch (err) {
        console.error('Google Registration Error:', err);
        setError('Error al registrarse con Google. Inténtalo de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
        
        {/* Success Modal */}
        {showSuccessModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => navigate('/login')} />
                <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">¡Bienvenido!</h3>
                    <p className="text-gray-500 font-medium mb-8">
                        Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y empezar a comprar.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        Ir al Inicio de Sesión
                    </button>
                </div>
            </div>
        )}

        {/* ===== Background ===== */}
        <div className="absolute inset-0 z-0">
            <img
                src="/background.png"
                alt="Fondo Farmacia"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </div>

        {/* ===== Card ===== */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl animate-fade-in-up">

            <Link
            to="/login"
            className="flex items-center text-sm text-gray-700 hover:text-blue-600 mb-6 transition w-fit font-medium"
            >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Login
            </Link>

            <div className="text-center mb-8">
                <img src="/logo_v2.png" alt="Logo" className="w-16 h-16 mx-auto mb-3 object-contain" />
                <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
                <p className="text-sm text-gray-600 mt-1">Únete para disfrutar de nuestros beneficios</p>
            </div>

            {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Nombre Completo</label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-10 py-3 rounded-lg bg-cyan-50/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Correo Electrónico</label>
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Ej. usuario@email.com"
                    className="w-full pl-10 py-3 rounded-lg bg-cyan-50/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Contraseña</label>
                <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Crea una contraseña segura"
                    className="w-full pl-10 py-3 rounded-lg bg-cyan-50/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Teléfono</label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={(e) => {
                        // Solo permitir números
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, telefono: val });
                    }}
                    required
                    placeholder="Ej. 5512345678 (10 dígitos)"
                    maxLength={10}
                    className="w-full pl-10 py-3 rounded-lg bg-cyan-50/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                </div>
                <p className="text-xs text-gray-500 pl-1">Mínimo 10 dígitos</p>
            </div>

            {/* Dirección */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Dirección</label>
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Calle Principal #123, Col. Centro"
                            className="w-full pl-10 py-3 rounded-lg bg-cyan-50/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={getLocation}
                        disabled={locationLoading}
                        title="Usar mi ubicación actual"
                        className={`px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
                            locationLoading 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                        }`}
                    >
                        {locationLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Navigation className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 pl-1">Haz clic en el botón para usar tu ubicación actual</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-lg font-bold flex justify-center gap-2 transition-all shadow-lg
                    ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
                `}
            >
                {loading ? (
                <>
                    <Loader2 className="animate-spin" />
                    Registrando...
                </>
                ) : (
                'Crear Cuenta'
                )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">O</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Registration */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-gray-200 shadow-sm font-bold hover:bg-gray-50 transition-all text-gray-700 active:scale-95"
            >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5"
                />
                Registrarse con Google
            </button>

            <div className="text-center text-sm text-gray-700 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Inicia sesión
                </Link>
            </div>
            </form>
        </div>
    </div>
  );
};

export default Registrar;
