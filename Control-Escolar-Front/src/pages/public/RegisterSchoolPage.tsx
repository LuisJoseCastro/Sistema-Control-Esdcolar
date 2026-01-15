import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School, Globe, Mail,
  CheckCircle2, Lock, Eye, EyeOff // <--- Iconos necesarios
} from 'lucide-react';

// Asegúrate de que las rutas a tus componentes sean correctas
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const RegisterSchoolPage: React.FC = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: '',
    domain: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Campos extra si los necesitas para el backend
    cardNumber: '', 
    expiryDate: '',
    cardHolder: ''
  });

  // --- MANEJADORES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiamos el error en cuanto el usuario escribe algo nuevo
    if (error) setError(null);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    // 2. Validar longitud mínima de 8 caracteres
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Si pasa las validaciones, procedemos
    setIsVerifying(true);

    // Simulación de proceso (API call)
    setTimeout(() => {
      setIsVerifying(false);
      setShowSuccess(true);
    }, 3000);
  };

  const handleFinalRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-whiteBg-50 pb-12">
      {/* Header */}
      <header className="px-12 py-6 bg-white border-b mb-10">
        <h1 className="text-3xl font-serif italic font-bold tracking-tighter">
          Academic<span className="text-teal-600">+</span>
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Registro de Institución</h2>
          <p className="text-gray-600 mt-2">Completa los datos para activar tu cuenta escolar</p>
        </div>

        <form onSubmit={handleConfirmPayment} className="space-y-8">
          <div className="flex justify-center">
            {/* SECCIÓN: DATOS DE LA ESCUELA */}
            <section className="w-full max-w-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-main-700 mb-3">
                <School size={20} /> Información Escolar
              </h3>

              <Card className="p-6 space-y-4 bg-whiteBg-100 shadow-grayDark-300 shadow-xl">
                <Input
                  label="Nombre de la escuela"
                  name="schoolName"
                  placeholder="Ej. Instituto Tecnológico Superior"
                  required
                  onChange={handleChange}
                />

                <Input
                  label="Dominio de la escuela"
                  name="domain"
                  placeholder="tesji.com"
                  icon={<Globe size={18} />}
                  required
                  onChange={handleChange}
                />

                <Input
                  label="Dirección del correo escolar"
                  name="email"
                  type="email"
                  placeholder="admin@tesji.com"
                  icon={<Mail size={18} />}
                  required
                  onChange={handleChange}
                />

                {/* --- SECCIÓN DE CONTRASEÑAS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Campo: Contraseña */}
                  <div className="relative">
                    <Input
                      label="Contraseña"
                      name="password"
                      // Cambia el tipo dinámicamente: text o password
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      icon={<Lock size={18} />}
                      required
                      onChange={handleChange}
                    />
                    <button
                      type="button" // Importante: type="button" para no enviar el form
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 transition-colors cursor-pointer"
                      tabIndex={-1} // Para que no moleste al navegar con Tab
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Campo: Confirmar Contraseña */}
                  <div className="relative">
                    <Input
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      icon={<Lock size={18} />}
                      required
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Mensaje de Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center font-medium animate-pulse">
                    {error}
                  </div>
                )}
              </Card>
            </section>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              variant="primary"
              type="submit"
              className="px-16 py-4 text-lg shadow-xl"
            >
              Confirmar pago y registrar
            </Button>
          </div>
        </form>
      </main>

      {/* MODAL DE VERIFICACIÓN (Loading) */}
      <Modal isOpen={isVerifying} onClose={() => { }} title="Verificando Datos">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner className="w-16 h-16 text-teal-600 mb-6" />
          <p className="text-xl font-medium text-gray-700">Procesando registro...</p>
          <p className="text-sm text-gray-500 mt-2">Por favor, no cierre esta ventana.</p>
        </div>
      </Modal>

      {/* MODAL DE ÉXITO */}
      <Modal isOpen={showSuccess} onClose={handleFinalRedirect} title="¡Registro Exitoso!">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle2 size={60} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Creada</h3>
          <p className="text-gray-600 max-w-xs mx-auto mb-8">
            La escuela <strong>{formData.schoolName}</strong> ha sido registrada correctamente.
          </p>
          <Button
            variant="primary"
            onClick={handleFinalRedirect}
            className="w-full py-3"
          >
            Ir al Login
          </Button>
        </div>
      </Modal>
    </div>
  );
};