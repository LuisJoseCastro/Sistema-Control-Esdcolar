import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
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

const parseEmail = (fullEmail: string): { rolePrefix: string, schoolDomain: string } | null => {
  const parts = fullEmail.split('@');
  if (parts.length !== 2) return null;
  const [localPart, domainPart] = parts;
  let rolePrefix = '';
  if (localPart.toLowerCase().startsWith('d')) rolePrefix = 'DOCENTE';
  else if (localPart.toLowerCase().startsWith('a')) rolePrefix = 'ALUMNO';
  else if (localPart.toLowerCase().startsWith('admin')) rolePrefix = 'ADMIN';
  const domainName = domainPart.split('.')[0];
  return { rolePrefix, schoolDomain: domainName };
};

export const LoginPageGeneral: React.FC = () => {
  const { login, isLoggedIn, role, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // 1. LEER LA URL
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [email, setEmail] = useState('Drodolfo@tesji.com');
  const [password, setPassword] = useState('1234');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. EFECTO DE REDIRECCIÓN AUTOMÁTICA
  useEffect(() => {
    if (isLoggedIn && !isLoading && role) {
      const destination = returnTo ? decodeURIComponent(returnTo) : getDefaultDashboard(role);
      console.log(`🚀 Redirigiendo a: ${destination}`);
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, role, isLoading, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    const parsedData = parseEmail(email);

    if (!parsedData || !parsedData.rolePrefix) {
      setError("Formato de correo inválido.");
      setFormLoading(false);
      return;
    }

    try {
      await login(email, password, parsedData.schoolDomain);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Credenciales inválidas.");
      setFormLoading(false);
    }
  };

  // 3. BLOQUEO DE PANTALLA
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

  // 4. RENDERIZADO DEL FORMULARIO
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
            {/* 👇 AQUÍ AGREGUÉ EL EJEMPLO EN LA CAJITA GRIS 👇 */}
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
              placeholder="Ej: Docente@tesji.com"
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

          {/* 👇 LINK AHORA ES AZUL (blue-600) 👇 */}
          <div className="flex justify-end mb-4">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {/* 👆 FIN DEL CAMBIO DE COLOR 👆 */}

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