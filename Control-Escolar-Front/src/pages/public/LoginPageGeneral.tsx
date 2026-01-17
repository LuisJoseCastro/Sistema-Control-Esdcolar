import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const getDefaultDashboard = (role: string) => {
  switch (role) {
    case 'ADMIN': return '/admin/dashboard';
    case 'DOCENTE': return '/docente/dashboard';
    case 'ALUMNO': return '/alumno/dashboard';
    default: return '/login';
  }
};

export const LoginPageGeneral: React.FC = () => {
  const { login, isLoggedIn, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [email, setEmail] = useState('carlos.profe@basico-v2.edu.mx');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && !isLoading && role) {
      const destination = returnTo ? decodeURIComponent(returnTo) : getDefaultDashboard(role);
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, role, isLoading, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    // 1. Validación simple de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de correo inválido.");
      setFormLoading(false);
      return;
    }

    // 2. Extraer el dominio para usarlo como schoolKey (ID del Tenant)
    // Ejemplo: 'juan@mi-escuela.com' -> schoolDomain = 'mi-escuela'
    const parts = email.split('@');
    const domainPart = parts[1]; 
    const schoolDomain = domainPart.split('.')[0]; // Toma lo que está antes del primer punto

    try {
      // 3. Intentar Login con el dominio extraído
      await login(email, password, schoolDomain);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
          // Si es error de red (CORS/Apagado), suele ser un TypeError con mensaje "Failed to fetch"
          if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
             setError("No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté encendido.");
          } else {
             setError(err.message);
          }
      } else {
          setError("Ocurrió un error inesperado al iniciar sesión.");
      }
      setFormLoading(false);
    }
  };

  if (isLoading || isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
        <LoadingSpinner className="w-12 h-12 text-teal-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          {isLoggedIn ? 'Ingresando al sistema...' : 'Verificando sesión...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
      <h2 className="text-3xl font-bold mb-6">Acceso Único al Sistema Escolar SaaS</h2>
      <form onSubmit={handleSubmit} className="bg-whiteBg-50 p-8 rounded-lg shadow-xl w-96">
        <div className='flex'>
          <div className='w-20 flex-none'>
            <img src="/Logo-Academy+.jpeg" alt="Logo" className='w-auto h-auto rounded-xl'/>
          </div>
          <div className='w-60 flex-1 bg-grayLight-400 mb-2 p-2 rounded-xl h-auto'>
            <p className=" text-sm text-center text-gray-800 font-semibold">
              Usa tu correo institucional
            </p>
          </div>
        </div>

        <div className="mb-4 p-5 bg-grayLight-400 rounded-xl">
          <div className='mt-0'>
            <label className="block font-semibold text-xl mb-1">Correo Institucional:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: usuario@escuela.edu"
              required
            />
          </div>

          <div className='mt-4 mb-4'>
            <label className="block font-semibold text-xl mb-1">Contraseña:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={formLoading}
            className="w-full"
          >
            {formLoading ? 'Validando...' : 'Iniciar Sesión'}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};