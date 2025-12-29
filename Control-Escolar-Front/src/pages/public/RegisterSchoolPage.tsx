import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, Globe, Mail, CreditCard, 
  Calendar, User, CheckCircle2 
} from 'lucide-react';

// Importación de tus componentes atómicos
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
  const [formData, setFormData] = useState({
    schoolName: '',
    domain: '',
    email: '',
    cardNumber: '', // Añadido por lógica de pago
    expiryDate: '',
    cardHolder: ''
  });

  // --- MANEJADORES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulación de verificación de pago (3 segundos)
    setTimeout(() => {
      setIsVerifying(false);
      setShowSuccess(true);
    }, 3000);
  };

  const handleFinalRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* SECCIÓN: DATOS DE LA ESCUELA */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-teal-700">
                <School size={20} /> Información Escolar
              </h3>
              
              <Card className="p-6 space-y-4">
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
              </Card>
            </section>

            {/* SECCIÓN: DATOS DE PAGO */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-teal-700">
                <CreditCard size={20} /> Detalles de Facturación
              </h3>
              
              <Card className="p-6 space-y-4 border-t-4 border-teal-500">
                <Input
                  label="Número de la tarjeta"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  icon={<CreditCard size={18} />}
                  required
                  onChange={handleChange}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Fecha de vencimiento"
                    name="expiryDate"
                    placeholder="MM/AA"
                    icon={<Calendar size={18} />}
                    required
                    onChange={handleChange}
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    required
                  />
                </div>

                <Input
                  label="Nombre del titular"
                  name="cardHolder"
                  placeholder="Como aparece en la tarjeta"
                  icon={<User size={18} />}
                  required
                  onChange={handleChange}
                />
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
      <Modal isOpen={isVerifying} onClose={() => {}} title="Verificando Pago">
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner className="w-16 h-16 text-teal-600 mb-6" />
          <p className="text-xl font-medium text-gray-700">Procesando su pago...</p>
          <p className="text-sm text-gray-500 mt-2">Por favor, no cierre esta ventana.</p>
        </div>
      </Modal>

      {/* MODAL DE ÉXITO */}
      <Modal isOpen={showSuccess} onClose={handleFinalRedirect} title="¡Registro Exitoso!">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle2 size={60} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Pago Confirmado</h3>
          <p className="text-gray-600 max-w-xs mx-auto mb-8">
            La escuela <strong>{formData.schoolName}</strong> ha sido activada correctamente. Ya puedes iniciar sesión.
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