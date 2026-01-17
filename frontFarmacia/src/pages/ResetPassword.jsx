import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get('token') || '';

  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token requerido. Usa el enlace del correo o pega el token aquí.');
      return;
    }

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
      await api.post('/usuarios/password/reset', { token, nuevaPassword: newPassword });
      setLoading(false);
      alert('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al restablecer contraseña.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/background.png" alt="Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Restablecer Contraseña</h2>
        <p className="text-center text-gray-600 mb-6">Ingresa tu nuevo password y el token recibido en el correo (si abriste el enlace, el token vendrá en la URL).</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center justify-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Token</label>
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Pega aquí el token si no abriste el enlace" className="w-full py-3 px-4 rounded-lg border bg-gray-50" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Confirmar Contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full py-3 px-4 rounded-lg border bg-gray-50" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-green-500/30 disabled:opacity-50">
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
