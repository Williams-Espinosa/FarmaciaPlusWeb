import React from 'react';

const LoadingScreen = ({ message = "Cargando Inteligencia de Negocio..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm shadow-blue-100"></div>
                <p className="text-slate-500 font-bold animate-pulse tracking-tight">{message}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
