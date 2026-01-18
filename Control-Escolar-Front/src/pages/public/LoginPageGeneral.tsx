import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Tu hook existente
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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

  // Efecto de Redirección automática
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

    // Validación básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de correo inválido");
      setFormLoading(false);
      return;
    }

    try {
      // ⚠️ CAMBIO IMPORTANTE: Solo pasamos email y password
      // El backend deduce la escuela por el correo del usuario
      await login(email, password); 
      
    } catch (err: any) {
      console.error(err);
      const msg = err.message || '';

      if (msg.includes("Network Error") || msg === "Failed to fetch") {
         setError("Error de conexión. Verifica que tu VPN/Tailscale esté activa.");
      } else if (msg.includes("401") || msg.includes("Unauthorized")) {
         setError("Credenciales incorrectas.");
      } else {
         setError(msg || "Ocurrió un error inesperado.");
      }
      setFormLoading(false);
    }
  };

  if (isLoading || isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
        <LoadingSpinner className="w-12 h-12 text-teal-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          {isLoggedIn ? 'Ingresando...' : 'Verificando sesión...'}
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
          <div className='w-60 flex-1 bg-grayLight-400 mb-2 p-2 rounded-xl h-auto flex flex-col justify-center'>
            <p className="text-sm text-center text-gray-800 font-semibold leading-tight">
              Usa tu correo institucional
            </p>
            <p className="text-xs text-center text-gray-500 mt-1">
              (Ej: Docente@tesji.com)
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

          <div className='mt-4 mb-2'>
            <label className="block font-semibold text-xl mb-1">Contraseña:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end mb-4">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
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
        {error && <p className="mt-4 text-red-500 text-center bg-red-100 p-2 rounded font-semibold">{error}</p>}
      </form>
    </div>
  );
};