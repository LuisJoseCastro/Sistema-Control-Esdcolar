// src/pages/public/OnboardingPage.tsx - CÓDIGO CORREGIDO

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarNuevaEscuela } from '../../services/onboarding.service'; 
// Asegúrate de que registrarNuevaEscuela esté en src/services/onboarding.service.ts

// IMPORTACIÓN DE COMPONENTES UI (Asumiendo que existen)
import { Button } from '../../components/ui/Button'; 
import { Input } from '../../components/ui/Input'; 
// También podrías usar Card si deseas encapsular el formulario
// import { Card } from '../../components/ui/Card'; 

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombrePlantel, setNombrePlantel] = useState('TESJI');
  const [dominio, setDominio] = useState('tesji'); 
  
  const [claveGenerada, setClaveGenerada] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombrePlantel || !dominio) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const resultado = await registrarNuevaEscuela(nombrePlantel, dominio); 
      setClaveGenerada(resultado.claveUnica);

    } catch (err: any) {
      setError(err.message || "Error al registrar la escuela. Intenta con otro dominio.");
    } finally {
      setLoading(false);
    }
  };

  // VISTA 1: Éxito (Muestra la clave única)
  if (claveGenerada) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <h2 className="text-4xl text-green-600 mb-6">✅ ¡Registro Exitoso!</h2>
        <p className="text-lg">Tu dominio institucional es: **@{dominio.toLowerCase()}.com**</p>
        <div className="mt-8 p-6 bg-white border border-green-400 rounded-lg shadow-xl text-center">
          <p className="font-bold text-xl">Clave Única de Registro (SaaS ID):</p>
          <code className="text-3xl text-red-600 font-mono block mt-2 p-2 bg-gray-100 rounded">
            {claveGenerada}
          </code>
          <p className="text-sm mt-4">Esta clave es necesaria para que tus usuarios se logueen en **`/login`**.</p>
        </div>
        {/* Botón de navegación usando el componente Button */}
        <Button 
          variant="primary"
          onClick={() => navigate('/login')}
          className="mt-8"
        >
          Ir a Iniciar Sesión
        </Button>
      </div>
    );
  }

  // VISTA 2: Formulario de Registro
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Registro de Nueva Institución (Onboarding)</h2>
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del Plantel:</label>
          {/* Reemplazo de <input> por componente Input */}
          <Input 
            type="text" 
            value={nombrePlantel} 
            onChange={(e) => setNombrePlantel(e.target.value)}
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Dominio (ej: tesji):</label>
          <div className="flex items-center">
             {/* Reemplazo de <input> por componente Input */}
            <Input 
              type="text" 
              value={dominio} 
              onChange={(e) => setDominio(e.target.value)}
              // Nota: Aquí se asume que tu Input soporta className para el estilo del borde
              className="w-full rounded-r-none" 
              required 
            />
            <span className="p-2 border border-l-0 rounded-r bg-gray-200">.com</span>
          </div>
        </div>
        
        {/* Botón de Submit usando el componente Button */}
        <Button 
          variant="primary"
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Registrando...' : 'Finalizar Registro'}
        </Button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};