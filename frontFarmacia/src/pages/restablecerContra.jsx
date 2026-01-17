import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import api from '../services/api';

const RestablecerContra = () => {
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [step, setStep] = useState(1);
const [code, setCode] = useState('');
const [generatedCode, setGeneratedCode] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await api.post('/usuarios/password/solicitar', { email });
        setLoading(false);
        setStep(2);
    } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.error || 'Error al solicitar restablecimiento.';
        setError(errorMsg);
        setLoading(false);
    }
};

const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code.length < 6) {
        setError('Por favor introduce el código de 6 dígitos que recibiste.');
        return;
    }
    setError('');
    setStep(3);
};

const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
    }
    
    if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    setLoading(true);

    try {
        await api.post('/usuarios/password/reset', { 
            token: code, 
            nuevaPassword: newPassword 
        });

        setLoading(false);
        alert('Contraseña restablecida con éxito. Ahora puedes iniciar sesión.');
        navigate('/login');
    } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.error || 'Error al restablecer contraseña.';
        setError(errorMsg);
        setLoading(false);
    }
};

return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
        
      {/* Background Effect */}
    <div className="absolute inset-0 z-0">
        <img
            src="/background.png"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
    </div>

    <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl animate-fade-in-up">
        <button 
            onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {step === 1 ? 'Volver al Login' : 'Atrás'}
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Restablecer Contraseña
        </h2>
        
        {step === 1 && <p className="text-center text-gray-600 mb-8">Ingresa tu correo para recibir un código de verificación.</p>}
        {step === 2 && <p className="text-center text-gray-600 mb-8">Hemos enviado un código a <span className="font-semibold text-blue-600">{email}</span></p>}
        {step === 3 && <p className="text-center text-gray-600 mb-8">Crea una nueva contraseña para tu cuenta.</p>}

        {/* Error Message */}
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center justify-center">
                {error}
            </div>
        )}

        {/* STEP 1: SOLICITAR CÓDIGO */}
        {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Correo Electrónico</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        placeholder="ejemplo@correo.com"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
            </form>
        )}

        {/* STEP 2: VERIFICAR CÓDIGO */}
        {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-800">Código de Verificación</label>
                <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input 
                        type="text" 
                        maxLength="6"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Solo números
                        required 
                        placeholder="123456"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center text-xl tracking-widest font-mono outline-none"
                    />
                </div>
            </div>
            <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30"
            >
                Verificar Código
            </button>
            </form>
        )}

        {/* STEP 3: NUEVA CONTRASEÑA */}
        {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800">Nueva Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-800">Confirmar Contraseña</label>
                    <div className="relative">
                        <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
            >
                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
            </button>
            </form>
        )}

    </div>
    </div>
);
};

export default RestablecerContra;
