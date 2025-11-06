// src/pages/admin/AdminDashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { type User, type Role } from '../../types/models';
import { getAllUsersByTenant, addNewUser } from '../../services/admin.service'; 

// Importación de Componentes UI
import { Button } from '../../components/ui/Button'; 
import { Input } from '../../components/ui/Input'; 

// Tipado para el formulario de nuevo usuario
type NewUserForm = Omit<User, 'id' | 'tenantId'>;

const initialNewUserState: NewUserForm = {
    nombre: '',
    email: '',
    rol: 'DOCENTE', // Por defecto, se agregan docentes
};


export const AdminDashboardPage: React.FC = () => {
    const { config } = useTenant();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [formUser, setFormUser] = useState<NewUserForm>(initialNewUserState);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tenantId = config?.id;

    // 1. Cargar Usuarios al iniciar la vista
    useEffect(() => {
        if (!tenantId) return;

        const fetchUsers = async () => {
            try {
                const loadedUsers = await getAllUsersByTenant(tenantId);
                // Filtramos al propio Administrador de la lista para gestionar solo Docentes/Alumnos
                setUsers(loadedUsers.filter(u => u.rol !== 'ADMIN'));
            } catch (err) {
                setError("Error al cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [tenantId]);

    // 2. Manejar el envío del formulario para agregar nuevo usuario
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        
        if (!tenantId) {
            setError("Error: El Tenant ID no está disponible.");
            setFormLoading(false);
            return;
        }

        try {
            // Se llama al servicio para simular la adición
            const newUserWithTenant = { ...formUser, tenantId };
            const success = await addNewUser(newUserWithTenant);

            if (success) {
                alert(`Usuario ${formUser.nombre} agregado exitosamente (Simulación).`);
                setFormUser(initialNewUserState); // Limpiar formulario
                // NOTA: En producción, recargaríamos la lista para ver el nuevo usuario.
                // Aquí solo simulamos para evitar complejidades del mock.
            }

        } catch (err) {
            setError("Error al intentar agregar el usuario.");
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return <div className="text-xl text-center mt-10">Cargando gestión de usuarios...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Administración de Usuarios: {config?.nombre}</h1>
            
            {/* Sección de Agregar Nuevo Usuario */}
            <section className="mb-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-semibold mb-4">Agregar Nuevo Usuario</h2>
                <form onSubmit={handleAddUser} className="grid grid-cols-5 gap-4 items-end">
                    
                    {/* Input Nombre */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                        <Input 
                            type="text" 
                            value={formUser.nombre} 
                            onChange={(e) => setFormUser({...formUser, nombre: e.target.value})}
                            required 
                        />
                    </div>
                    
                    {/* Input Email */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <Input 
                            type="email" 
                            value={formUser.email} 
                            onChange={(e) => setFormUser({...formUser, email: e.target.value})}
                            placeholder={`Ej: D.nuevo@${config?.nombre.toLowerCase().split(' ')[0]}.com`}
                            required 
                        />
                    </div>

                    {/* Select Rol */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Rol:</label>
                        {/* Nota: Idealmente usarías un componente Select de tu librería UI */}
                        <select 
                            value={formUser.rol} 
                            onChange={(e) => setFormUser({...formUser, rol: e.target.value as Role})}
                            className="w-full border p-2 rounded-md h-[42px]"
                            required
                        >
                            <option value="DOCENTE">Docente</option>
                            <option value="ALUMNO">Alumno</option>
                        </select>
                    </div>

                    {/* Botón de Submit usando el componente Button */}
                    <div className="col-span-1">
                        <Button 
                            variant="primary"
                            type="submit" 
                            disabled={formLoading}
                            className="w-full h-[42px]"
                        >
                            {formLoading ? 'Agregando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </section>

            {/* Sección de Listado de Usuarios */}
            <section className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios ({users.length})</h2>
                
                {/* Tabla de Usuarios */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.rol === 'DOCENTE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.rol}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {/* Botones de acción (Simulación) */}
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay Docentes ni Alumnos registrados.</div>
                )}
            </section>
        </div>
    );
};