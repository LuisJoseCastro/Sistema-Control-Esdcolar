import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School, Globe, Mail,
  CheckCircle2, Lock, Eye, EyeOff, XCircle, CheckCircle
} from 'lucide-react';

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

  // Estados visuales
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: '',
    domain: '',
    email: '',
    password: '',
    confirmPassword: '',
    cardNumber: '',
    expiryDate: '',
    cardHolder: ''
  });

  // --- VALIDACIONES EN TIEMPO REAL (REGEX) ---
  const hasMinLength = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password); // Al menos una mayúscula
  const hasLowerCase = /[a-z]/.test(formData.password); // Al menos una minúscula
  const hasNumber = /\d/.test(formData.password);       // Al menos un número
  // Nueva validación: Busca cualquier caracter que NO sea letra ni número (ej: @, #, -, !)
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(formData.password); 

  // Ahora se deben cumplir las 5 condiciones
  const isPasswordStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  // --- MANEJADORES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!isPasswordStrong) {
      setError("La contraseña no es lo suficientemente segura.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowSuccess(true);
    }, 3000);
  };

  const handleFinalRedirect = () => {
    navigate('/login');
  };

  // Componente visual para la lista
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
      {met ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-whiteBg-50 pb-12">
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contraseña */}
                    <div className="relative">
                      <Input
                        label="Contraseña"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crear contraseña"
                        icon={<Lock size={18} />}
                        required
                        onChange={handleChange}
                        className={formData.password && !isPasswordStrong ? "border-orange-300 focus:ring-orange-200" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Confirmar Contraseña */}
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
                        className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* --- LISTA DE REQUISITOS (Ahora con caracteres especiales) --- */}
                  {formData.password.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">
                        La contraseña debe contener:
                      </p>
                      {/* Usamos un grid de 2 columnas para que se vea ordenado */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        <PasswordRequirement met={hasMinLength} text="Mínimo 8 caracteres" />
                        <PasswordRequirement met={hasUpperCase} text="Una letra mayúscula" />
                        <PasswordRequirement met={hasLowerCase} text="Una letra minúscula" />
                        <PasswordRequirement met={hasNumber} text="Un número" />
                        {/* Nuevo requisito visual */}
                        <div className="col-span-1 sm:col-span-2">
                            <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (@, #, $, %, etc.)" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600 text-sm font-medium animate-pulse">
                    <XCircle size={18} />
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
              className={`px-16 py-4 text-lg shadow-xl transition-all ${
                !isPasswordStrong && formData.password.length > 0 ? 'opacity-70 grayscale cursor-not-allowed' : ''
              }`}
            >
              Registrar
            </Button>
          </div>
        </form>
      </main>

      {/* Modales (Sin cambios) */}
      <Modal isOpen={isVerifying} onClose={() => { }} title="Verificando Datos">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner className="w-16 h-16 text-teal-600 mb-6" />
          <p className="text-xl font-medium text-gray-700">Procesando registro...</p>
        </div>
      </Modal>

      <Modal isOpen={showSuccess} onClose={handleFinalRedirect} title="¡Registro Exitoso!">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle2 size={60} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Creada</h3>
          <p className="text-gray-600 max-w-xs mx-auto mb-8">
            La escuela <strong>{formData.schoolName}</strong> ha sido registrada correctamente.
          </p>
          <Button variant="primary" onClick={handleFinalRedirect} className="w-full py-3">
            Ir al Login
          </Button>
        </div>
      </Modal>
    </div>
  );
};