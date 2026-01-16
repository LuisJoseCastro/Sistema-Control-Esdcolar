import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    School, Globe, Mail,
    CheckCircle2, Lock, Eye, EyeOff,
    CreditCard, User, XCircle, CheckCircle
} from 'lucide-react';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

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

    const hasMinLength = formData.password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(formData.password);

    const isPasswordStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const cleanValue = value.replace(/\D/g, '');
            const limitedValue = cleanValue.slice(0, 16);
            const formattedValue = limitedValue.match(/.{1,4}/g)?.join(' ') || limitedValue;
            
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
            return;
        }

        if (name === 'expiryDate') {
            const cleanValue = value.replace(/\D/g, '');
            let formattedValue = cleanValue;

            if (cleanValue.length > 2) {
                formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
            }
            
            if (formattedValue.length <= 5) {
                setFormData(prev => ({ ...prev, [name]: formattedValue }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleConfirmPayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (!isPasswordStrong) {
            setError("La contraseña no es lo suficientemente segura.");
            return;
        }
        if (formData.cardNumber.length < 19 || formData.expiryDate.length < 5) {
            setError("Por favor, completa los datos de facturación.");
            return;
        }
        setError(null);
        setIsVerifying(true);

        try {
            
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const tokenSimulado = "tok_visa";
            const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');
            const ultimos4 = cleanCardNumber.length > 4
                ? cleanCardNumber.slice(-4)
                : '0000';
            
            const payload = {
                nombreEscuela: formData.schoolName,
                dominioEscuela: formData.domain,
                emailAdmin: formData.email,
                passwordAdmin: formData.password,
                plan: 'PRO',
                
                nombreTitular: formData.cardHolder,
                tarjetaUltimos4: ultimos4,
                tokenPago: tokenSimulado
            };

            console.log(`Plan PRO seleccionado: ${apiUrl}/tenants/register`);

            const response = await fetch(`${apiUrl}/tenants/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro PRO');
            }

            console.log('Registrado en el plan PRO:', data);
            setIsVerifying(false);
            setShowSuccess(true);

        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || "Error al procesar el pago y registro");
            setIsVerifying(false);
        }
    };

    const handleFinalRedirect = (): void => {
        navigate('/login');
    };

    const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
            {met ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
            {text}
        </div>
    );

    return (
        <div className="min-h-screen bg-whiteBg-50 pb-12">
            <header className="px-6 md:px-12 py-6 bg-white border-b mb-10">
                <h1 className="text-3xl font-serif italic font-bold tracking-tighter">
                    Academy<span className="text-teal-600">+</span>
                </h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Registro de Institución</h2>
                    <p className="text-gray-600 mt-2">Completa los datos para activar tu cuenta escolar</p>
                </div>

                <form onSubmit={handleConfirmPayment} className="space-y-8">
                    <div className="flex flex-col lg:flex-row justify-center gap-8 bg-transparent md:bg-whiteBg-50 md:p-8 rounded-2xl">

                        {/* datos de la escuela */}
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
                                            placeholder="Crear contraseña"
                                            icon={<Lock size={18} />}
                                            required
                                            onChange={handleChange}
                                            className={formData.password && !isPasswordStrong ? "border-orange-300 focus:ring-orange-200" : ""}
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

                                {formData.password.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                                        <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">
                                            Seguridad de la contraseña:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                            <PasswordRequirement met={hasMinLength} text="Mínimo 8 caracteres" />
                                            <PasswordRequirement met={hasUpperCase} text="Una mayúscula" />
                                            <PasswordRequirement met={hasLowerCase} text="Una minúscula" />
                                            <PasswordRequirement met={hasNumber} text="Un número" />
                                            <div className="col-span-1 sm:col-span-2">
                                                <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (@, #, $...)" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2 justify-center font-medium animate-pulse">
                                        <XCircle size={16} />
                                        {error}
                                    </div>
                                )}
                            </Card>
                        </section>

                        {/* sección de pago */}
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
                                    type="text"
                                    maxLength={19}
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
                                        type="text"
                                        maxLength={5}
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
                            className={`w-full md:w-auto md:px-20 py-4 text-lg shadow-xl transition-all ${!isPasswordStrong && formData.password.length > 0 ? 'opacity-75' : ''
                                }`}
                        >
                            Confirmar pago y registrar
                        </Button>
                    </div>
                </form>
            </main>

            {/* modales */}
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