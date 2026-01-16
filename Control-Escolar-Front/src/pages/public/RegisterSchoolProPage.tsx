import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    School, Globe, Mail,
    CheckCircle2, Lock, Eye, EyeOff,
    CreditCard,
    User
} from 'lucide-react';

// Importación de tus componentes (asumiendo que tienen sus propios tipos)
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Definimos una interfaz para el estado del formulario
interface SchoolFormData {
    schoolName: string;
    domain: string;
    email: string;
    password: string;
    confirmPassword: string;
    cardNumber: string;
    expiryDate: string;
    cardHolder: string;
}

export const RegisterSchoolProPage: React.FC = () => {
    const navigate = useNavigate();

    // --- ESTADOS TIPADOS ---
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [formData, setFormData] = useState<SchoolFormData>({
        schoolName: '',
        domain: '',
        email: '',
        password: '',
        confirmPassword: '',
        cardNumber: '',
        expiryDate: '',
        cardHolder: ''
    });

    // --- MANEJADORES ---
    // Usamos ChangeEvent<HTMLInputElement> para el tipado de los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmPayment = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor verifícalas.");
            return;
        }

        if (formData.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setError(null);
        setIsVerifying(true);

        // Simulación de verificación
        setTimeout(() => {
            setIsVerifying(false);
            setShowSuccess(true);
        }, 3000);
    };

    const handleFinalRedirect = (): void => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-whiteBg-50 pb-12">
            {/* Header adaptable */}
            <header className="px-6 md:px-12 py-6 bg-white border-b mb-10">
                <h1 className="text-3xl font-serif italic font-bold tracking-tighter">
                    Academic<span className="text-teal-600">+</span>
                </h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Registro de Institución</h2>
                    <p className="text-gray-600 mt-2">Completa los datos para activar tu cuenta escolar</p>
                </div>

                <form onSubmit={handleConfirmPayment} className="space-y-8">
                    {/* Contenedor Responsive sin desbordamientos */}
                    <div className="flex flex-col lg:flex-row justify-center gap-8 bg-transparent md:bg-whiteBg-50 md:p-8 rounded-2xl">

                        {/* SECCIÓN: DATOS DE LA ESCUELA */}
                        <section className="flex-[1.5] w-full">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-main-700 mb-4">
                                <School size={20} /> Información Escolar
                            </h3>

                            <Card className="w-full p-6 space-y-4 bg-whiteBg-100 shadow-grayDark-300 shadow-xl border-none">
                                <Input
                                    label="Nombre de la escuela"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    placeholder="Ej. Instituto Tecnológico Superior"
                                    required
                                    onChange={handleChange}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Dominio"
                                        name="domain"
                                        value={formData.domain}
                                        placeholder="tesji.com"
                                        icon={<Globe size={18} />}
                                        required
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Correo escolar"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        placeholder="admin@tesji.com"
                                        icon={<Mail size={18} />}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Input
                                            label="Contraseña"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            placeholder="Mínimo 8 caracteres"
                                            icon={<Lock size={18} />}
                                            required
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            label="Confirmar Contraseña"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            placeholder="Repite la contraseña"
                                            icon={<Lock size={18} />}
                                            required
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-[2.4rem] text-gray-400 hover:text-teal-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}
                            </Card>
                        </section>

                        {/* SECCIÓN: DATOS DE PAGO */}
                        <section className="flex-1 w-full">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-main-700 mb-4">
                                <CreditCard size={20} /> Detalles de Facturación
                            </h3>

                            <Card className="w-full p-6 space-y-4 border-t-4 bg-whiteBg-100 shadow-grayDark-300 shadow-xl">
                                <Input
                                    label="Número de la tarjeta"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    type="number"
                                    icon={<CreditCard size={18} />}
                                    required
                                    onChange={handleChange}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Vencimiento"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        placeholder="MM/AA"
                                        type="date"
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
                                    label="Titular"
                                    name="cardHolder"
                                    value={formData.cardHolder}
                                    placeholder="Nombre completo"
                                    type="text"
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
                            className="w-full md:w-auto md:px-20 py-4 text-lg shadow-xl"
                        >
                            Confirmar pago y registrar
                        </Button>
                    </div>
                </form>
            </main>

            {/* MODALES */}
            <Modal isOpen={isVerifying} onClose={() => { }} title="Verificando Datos">
                <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner className="w-16 h-16 text-teal-600 mb-6" />
                    <p className="text-xl font-medium text-gray-700 text-center">Procesando registro...</p>
                </div>
            </Modal>

            <Modal isOpen={showSuccess} onClose={handleFinalRedirect} title="¡Registro Exitoso!">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-6">
                        <CheckCircle2 size={60} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Cuenta Creada</h3>
                    <p className="text-gray-600 max-w-xs mx-auto mb-8">
                        La escuela <strong>{formData.schoolName}</strong> ha sido registrada.
                    </p>
                    <Button variant="primary" onClick={handleFinalRedirect} className="w-full py-3">
                        Ir al Login
                    </Button>
                </div>
            </Modal>
        </div>
    );
};