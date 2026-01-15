import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle, BookOpen, ClipboardCheck, CreditCard } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type PlanType = 'gratuito' | 'pago' | null;

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);

  const solutions = [
    {
      title: 'Gestión Académica',
      desc: 'Registro de notas, cálculo automático de promedios, y generación de boletas digitales en tiempo real.',
      icon: <BookOpen className="text-main-800 w-6 h-6" />
    },
    {
      title: 'Control de Asistencia',
      desc: 'Registro de asistencia diario, reportes mensuales por alumno y notificaciones automáticas.',
      icon: <ClipboardCheck className="text-mainl8600 w-6 h-6" />
    },
    {
      title: 'Comunicación Instantánea',
      desc: 'Mensajería directa con padres y alumnos, avisos, circulares y notificaciones push vía app móvil.',
      icon: <MessageCircle className="text-main-800 w-6 h-6" />
    },
    {
      title: 'Gestión Administrativa',
      desc: 'Emisión de facturas, recordatorios de pago automáticos y reportes financieros detallados.',
      icon: <CreditCard className="text-main-800 w-6 h-6" />
    }
  ];

  // --- LÓGICA DE NAVEGACIÓN CORREGIDA ---
  const handleRegisterAction = () => {
    if (selectedPlan) {
      // Ahora redirige a la ruta del formulario de registro
      navigate('/register-school'); 
    }
  };

  return (
    <div className="min-h-screen bg-whiteBg-50 font-sans text-gray-800 pb-20">
      <header className="flex justify-between items-center px-12 py-6">
        <h1 className="text-4xl font-serif italic font-bold tracking-tighter">
          Academic<span className="text-teal-600">+</span>
        </h1>
        <div className="grid items-center bg-main-700 hover:bg-main-900 transition-color duration-300 p-y2 p-x6 h-10 w-90 text-center rounded-xl">
        <button 
          onClick={() => navigate('/login')}
          className="text-whiteBg-200 hover:text-whiteBg-50 font-gold text-xl  cursor-pointer"
        >
          ¿Ya tienes una cuenta?
        </button>

        </div>
      </header>

      <section className="text-center mt-4">
        <h2 className="text-3xl font-semibold mb-10">Nuestras soluciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12">
          {solutions.map((item, index) => (
            <Card key={index} variant="default" className="flex flex-col items-center text-center h-full bg-whiteBg-100 shadow-grayDark-300 shadow-xl hover:scale-y-110 transition-normal duration-400">
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center mt-16">
        <h2 className="text-3xl font-semibold mb-10">Elige el Plan Perfecto para Ti</h2>
        <div className='flex items-center border border-main-900  mt-0 mx-20 mb-10 w-100% alight-center'></div>
        <div className="flex flex-col md:flex-row justify-center gap-12 px-12 max-w-6xl mx-auto">
          {/* PLAN GRATUITO */}
          <Card 
            className={`bg-whiteBg-100 shadow-grayDark-300 shadow-xl w-full md:w-1/2 transition-all duration-300 ${selectedPlan === 'gratuito' ? 'ring-4 ring-main-600 scale-105' : 'bg-blue-50/30'}`}
            header={<div className="text-center w-full">Plan Gratuito</div>}
          >
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center text-gray-500"><X className="text-red-500 mr-2 w-5 h-5" /> Reportes completos (PDF, Excel)</li>
              <li className="flex items-center text-gray-500"><X className="text-red-500 mr-2 w-5 h-5" /> BackUp automático</li>
              <li className="flex items-center text-gray-500"><X className="text-red-500 mr-2 w-5 h-5" /> Generación de Reportes Académicos</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Dashboard de avisos</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Gestión de Plan de Estudios</li>
            </ul>
            <Button 
              variant={selectedPlan === 'gratuito' ? 'primary' : 'secondary'}
              className="w-full"
              onClick={() => setSelectedPlan('gratuito')}
            >
              {selectedPlan === 'gratuito' ? 'Seleccionado' : 'Seleccionar'}
            </Button>
          </Card>

          {/* PLAN DE PAGO */}
          <Card 
            className={`w-full bg-whiteBg-100 shadow-grayDark-300 shadow-xl md:w-1/2 transition-all duration-300 ${selectedPlan === 'pago' ? 'ring-4 ring-main-600 scale-105' : ''}`}
            header={<div className="text-center w-full">Plan De Pago</div>}
          >
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Reportes completos (PDF, Excel)</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> BackUp automático</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Generación de Reportes Académicos</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Disponibilidad completa de Dashboard de avisos</li>
              <li className="flex items-center"><Check className="text-green-500 mr-2 w-5 h-5" /> Gestión de Plan de Estudios</li>
            </ul>
            <Button 
              variant={selectedPlan === 'pago' ? 'primary' : 'secondary'}
              className="w-full"
              onClick={() => setSelectedPlan('pago')}
            >
              {selectedPlan === 'pago' ? 'Seleccionado' : 'Seleccionar'}
            </Button>
          </Card>
        </div>
      </section>

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${selectedPlan ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <Button 
          variant="primary" 
          className="px-12 py-4 bg-slate-600 hover:bg-slate-700 shadow-2xl"
          onClick={handleRegisterAction}
        >
          Registrar mi escuela
        </Button>
      </div>
    </div>
  );
};