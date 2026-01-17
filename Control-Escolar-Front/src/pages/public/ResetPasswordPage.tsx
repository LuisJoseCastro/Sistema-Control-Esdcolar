import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPassword } from '../../services/auth.service';

// Componentes Atómicos
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-whiteBg-50 p-4">
                <Card className="p-8 text-center max-w-md bg-white border-red-100 border">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800">Enlace inválido</h2>
                    <p className="text-gray-600 mt-2">El enlace de recuperación no es válido o ha expirado.</p>
                    <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate('/forgot-password')}>
                        Solicitar nuevo enlace
                    </Button>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            // Éxito: Redirigir
            alert('¡Contraseña actualizada con éxito!');
            navigate('/login');
        } catch (err: any) {
            setError('El enlace ha expirado. Por favor solicita uno nuevo.');
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
                <h2 className="text-xl font-semibold text-gray-700">Nueva Contraseña</h2>
            </header>

            <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border-none">
                <p className="text-center text-gray-600 mb-6">
                    Crea una nueva contraseña segura para tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Input
                            label="Nueva Contraseña"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock size={18} />}
                            placeholder="Mínimo 6 caracteres"
                            required
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

                    <Input
                        label="Confirmar Contraseña"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<CheckCircle2 size={18} />}
                        placeholder="Repite tu contraseña"
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
                        {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};