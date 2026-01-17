import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ======================
    // LOGIN NORMAL
    // ======================
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/usuarios/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            const rol = res.data.user.rol;

            if (rol === 1 || rol === 'admin') navigate('/admin/perfil');
            else if (rol === 2 || rol === 'empleado') navigate('/empleado/perfil');
            else if (rol === 3 || rol === 'cliente') navigate('/cliente/perfil');
            else navigate('/');

        } catch (err) {
            console.error(err);
            const backendError = err.response?.data?.error || err.response?.data?.message;
            setError(
                backendError || 'No pudimos iniciar sesión. Verifica tus credenciales.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================
    // LOGIN CON GOOGLE
    // ======================
    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const res = await api.post('/usuarios/login', {
                email: user.email,
                nombre: user.displayName,
                isGoogle: true
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
            console.error('Google Login Error:', err);
            setError('Error al iniciar sesión con Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900">

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

                {/* ===== Header ===== */}
                <div className="text-center mb-8">
                    <img
                        src="/logo_v2.png"
                        alt="Farmacia Central"
                        className="w-40 mx-auto mb-4 drop-shadow-lg"
                    />
                    <h1 className="text-3xl font-bold text-gray-900">
                        Farmacia Central
                    </h1>
                    <p className="text-sm text-gray-700 font-medium mt-1">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* ===== Form ===== */}
                <form onSubmit={handleLogin} className="space-y-6">

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-800">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="correo@ejemplo.com"
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-cyan-50/90 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-800">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="••••••••"
                                className={`w-full pl-12 pr-14 py-3 rounded-lg bg-cyan-50/90 border transition-all 
                                    ${error.toLowerCase().includes('contraseña') || error.toLowerCase().includes('incorrecta')
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-blue-200 focus:border-blue-500 focus:ring-blue-500/20'}
                                `}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                            >
                                {showPassword ? 'Ocultar' : 'Ver'}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => navigate('/restablecer')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 text-sm text-center text-red-700 bg-red-100 border border-red-200 rounded-lg font-medium">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all
                            ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        {loading ? 'Verificando...' : 'Iniciar sesión'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-500 font-medium">
                            O continúa con
                        </span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white border border-gray-200 shadow-sm font-semibold hover:bg-gray-50 transition-all text-gray-700"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-5 h-5"
                        />
                        Google
                    </button>

                    {/* Register */}
                    <div className="text-center text-sm mt-4">
                        <span className="text-gray-700">¿No tienes cuenta?</span>{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-bold text-blue-600 hover:underline"
                        >
                            Crear cuenta
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-gray-800 font-semibold mt-8">
                    © 2025 Farmacia Central
                </p>
            </div>
        </div>
    );
};

export default Login;
