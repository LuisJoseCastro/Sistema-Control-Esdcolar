// src/pages/public/LoginPageGeneral.tsx - CÓDIGO FINAL CON COMPONENTES UI

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// IMPORTACIÓN DE COMPONENTES UI (Asumiendo que existen)
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
// Si usas un Card para el formulario, también lo importarías:
// import { Card } from '../../components/ui/Card'; 

// Función para analizar el email y extraer el rol y el dominio (SaaS Key)
const parseEmail = (fullEmail: string): { rolePrefix: string, schoolDomain: string } | null => {
  const parts = fullEmail.split('@');
  if (parts.length !== 2) return null;

  const [localPart, domainPart] = parts;

  // Determinar el prefijo del Rol
  let rolePrefix = '';
  if (localPart.toLowerCase().startsWith('d')) {
    rolePrefix = 'DOCENTE';
  } else if (localPart.toLowerCase().startsWith('a')) {
    rolePrefix = 'ALUMNO';
  } else if (localPart.toLowerCase().startsWith('admin')) {
    rolePrefix = 'ADMIN';
  }

  // Extraer el dominio (SaaS Key).
  const domainName = domainPart.split('.')[0];

  return { rolePrefix, schoolDomain: domainName };
};


export const LoginPageGeneral: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('Drodolfo@tesji.com');
  const [password, setPassword] = useState('1234');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedData = parseEmail(email);

    if (!parsedData || !parsedData.rolePrefix) {
      setError("Formato de correo inválido. Asegura incluir el prefijo de rol (D, A, Admin).");
      setLoading(false);
      return;
    }

    const schoolKey = parsedData.schoolDomain;

    try {
      const rol = await login(email, password, schoolKey);
      navigate(`/${rol.toLowerCase()}/dashboard`, { replace: true });

    } catch (err: any) {
      setError(err.message || "Credenciales, dominio o clave inválida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
      <h2 className="text-3xl font-bold mb-6">Acceso Único al Sistema Escolar SaaS</h2>
      <form onSubmit={handleSubmit} className="bg-whiteBg-50 p-8 rounded-lg shadow-xl w-96">
        <div className='flex'>
          <div className='w-20 flex-none ...'>
            <p>Icon</p>
          </div>
          <div className='w-60 flex-1 bg-grayLight-400 mb-2 p-2 rounded-xl h-auto'>
            <p className=" text-sm text-center text-gray-800 font-semibold">
              Usa tu correo institucional (ej: Dfernando@tesji.com)
            </p>
          </div>

        </div>

        {/* Campo Único de Email/Usuario usando el componente Input */}
        <div className="mb-4 p-5 bg-grayLight-400 rounded-xl">
          <div className='mt-0'>
            <label className="block font-semibold text-xl mb-1">Correo Institucional:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: Docente@tesji.com"
              required
            />

          </div>

          {/* Campo de Password usando el componente Input */}
          <div className='mt-4 mb-4'>
            <label className="block font-semibold text-xl mb-1">Contraseña:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          {/* Botón de Submit usando el componente Button */}
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            // Aquí se pasa la clase para el estilo, si el Button lo soporta
            className="w-full"
          >
            {loading ? 'Verificando acceso...' : 'Iniciar Sesión'}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};