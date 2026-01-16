import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom'; // IMPORTAR useLocation
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Determina el dashboard por defecto si no hay ruta previa
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
  const location = useLocation(); // Hook para leer el estado de navegación

  // 1. Intentamos leer de dónde venía el usuario
  // 'from' será la ruta (ej: /admin/alumnos) o undefined
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('Drodolfo@tesji.com');
  const [password, setPassword] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. REDIRECCIÓN AUTOMÁTICA (Al recargar la página)
  useEffect(() => {
    if (isLoggedIn && !isLoading && role) {
      // Si venía de algún lado, lo regresamos ahí. Si no, al dashboard.
      const destination = from || getDefaultDashboard(role);
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, role, isLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedData = parseEmail(email);

    if (!parsedData || !parsedData.rolePrefix) {
      setError("Formato de correo inválido. Asegura incluir el prefijo de rol.");
      setLoading(false);
      return;
    }

    const schoolKey = parsedData.schoolDomain;

    try {
      const userRole = await login(email, password, schoolKey);
      
      // 3. REDIRECCIÓN MANUAL (Al hacer click en Iniciar Sesión)
      const destination = from || getDefaultDashboard(userRole);
      navigate(destination, { replace: true });

    } catch (err: any) {
      setError(err.message || "Credenciales, dominio o clave inválida.");
    } finally {
      setLoading(false);
    }
  };

  // Si se está verificando la sesión, mostramos carga en lugar del formulario
  // para evitar que el usuario intente loguearse dos veces
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
        <p className="text-gray-500 font-semibold animate-pulse">Recuperando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-whiteBg-100">
      <h2 className="text-3xl font-bold mb-6">Acceso Único al Sistema Escolar SaaS</h2>
      <form onSubmit={handleSubmit} className="bg-whiteBg-50 p-8 rounded-lg shadow-xl w-96">
        <div className='flex'>
          <div className='w-20 flex-none'>
            {/* Ajusta la ruta de la imagen si es necesaria */}
            <img src="/Logo-Academy+.jpeg" alt="Logo del sistema" className='w-auto h-auto rounded-xl'/>
          </div>
          <div className='w-60 flex-1 bg-grayLight-400 mb-2 p-2 rounded-xl h-auto'>
            <p className=" text-sm text-center text-gray-800 font-semibold">
              Usa tu correo institucional (ej: Dfernando@tesji.com)
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
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};