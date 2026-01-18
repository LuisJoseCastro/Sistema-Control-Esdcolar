import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth.service'; // 👈 Usamos el servicio unificado

// Componentes Atómicos
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [debugLink, setDebugLink] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email.includes('@')) {
            setError('Por favor ingresa un correo válido.');
            setIsLoading(false); // 🚨 Importante detener el loading aquí
            return;
        }

        try {
            // 1. Llamada real al backend
            const data = await authService.forgotPassword(email);
            setIsSuccess(true);
            setDebugLink(data.link || ''); // El backend debe enviar este link en desarrollo
        } catch (err: any) {
            // 2. Manejo de error con el diseño original
            setError(err.response?.data?.message || 'No pudimos procesar tu solicitud. Verifica el correo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-whiteBg-50 flex flex-col items-center justify-center p-6">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-serif italic font-bold tracking-tighter mb-2">
                    Academy<span className="text-teal-600">+</span>
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">Recuperación de Cuenta</h2>
            </header>

            <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border-none">
                {!isSuccess ? (
                    <>
                        <div className="text-center mb-6">
                            <p className="text-gray-600">
                                Ingresa tu correo institucional. Te enviaremos las instrucciones para restablecer tu acceso.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Correo Institucional"
                                name="email"
                                type="email"
                                placeholder="ejemplo@escuela.edu.mx"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail size={18} />}
                                required
                            />

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm font-medium animate-pulse">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-full py-3 text-lg" 
                                disabled={isLoading}
                            >
                                {isLoading ? <LoadingSpinner className="w-5 h-5 text-white" /> : 'Enviar enlace'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Correo Enviado!</h3>
                        <p className="text-gray-600 mb-6">
                            Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                        </p>
                        
                        {/* 🚧 SOLO DEV: Mantenemos tu bloque de depuración */}
                        {debugLink && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-left text-xs break-all mb-6">
                                <strong>[DEV LINK]:</strong> <br/>
                                <a href={debugLink} className="text-blue-600 underline">{debugLink}</a>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </Card>
        </div>
    );
};