// src/pages/public/LandingPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
        Sistema Escolar SaaS
      </h1>
      <p className="text-xl text-gray-600 mb-10">
        La plataforma inteligente para tu institución.
      </p>

      {/* Sección de Presentación y Precios */}
      <div className="grid grid-cols-3 gap-8 w-4/5">
        <div className="p-6 border rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Planes</h2>
          <p>Ver planes y características.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Métodos de Pago</h2>
          <p>Consulta opciones de facturación.</p>
        </div>
        <div className="p-6 bg-green-500 text-white rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">¡Comienza Ahora!</h2>
          <button 
            onClick={() => navigate('/onboarding')}
            className="mt-2 bg-white text-green-500 font-bold py-2 px-4 rounded hover:bg-gray-100"
          >
            Registrar mi Escuela
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/acceso')}
        className="mt-12 text-blue-600 hover:underline"
      >
        ¿Ya tienes cuenta? Ir a Acceso
      </button>
    </div>
  );
};