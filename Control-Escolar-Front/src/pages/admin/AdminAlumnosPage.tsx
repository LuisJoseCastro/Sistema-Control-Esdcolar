import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export const AdminAlumnosPage: React.FC = () => {
  const navigate = useNavigate();
  
  const grupos = [
    { id: 1, nombre: 'GRUPO 3A', alumnos: 25 },
    { id: 2, nombre: 'GRUPO 3B', alumnos: 28 },
    { id: 3, nombre: 'GRUPO 3C', alumnos: 22 },
    { id: 4, nombre: 'GRUPO 4A', alumnos: 30 },
    { id: 5, nombre: 'GRUPO 4B', alumnos: 26 },
    { id: 6, nombre: 'GRUPO 4C', alumnos: 24 },
  ];

  const handleVerAlumnos = (grupoNombre: string) => {
    const grupoId = grupoNombre.replace('GRUPO ', '');
    navigate(`/admin/alumnos/${grupoId}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-4 mb-8">
        <h1 
          className="text-5xl text-black font-['Kaushan_Script']"
        >
          Grupos de Alumnos
        </h1>
        <div className="text-sm text-gray-600">
          Total: {grupos.length} grupos
        </div>
      </header>

      {/* CONTENIDO DE GRUPOS */}
      <div className="font-['Lato']">
        <h2 className="font-['Kaushan_Script'] text-4xl text-[#2E4156] mb-8">
          Grupos Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {grupos.map((grupo) => (
            <Card
              key={grupo.id}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              variant="elevated"
              onClick={() => handleVerAlumnos(grupo.nombre)}
            >
              <div className="w-full h-48 bg-[#D4D8DD] rounded-t-lg mb-4 flex items-center justify-center">
                <div className="text-5xl font-bold text-[#2E4156] opacity-50">
                  {grupo.nombre.slice(-2)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#2E4156] mb-2">
                  {grupo.nombre}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    {grupo.alumnos} alumnos
                  </p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Activo
                  </span>
                </div>
                
                {/* Acciones */}
                <div className="mt-4 flex gap-2">
                  <button 
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerAlumnos(grupo.nombre);
                    }}
                  >
                    Ver Alumnos
                  </button>
                  <button 
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Editar grupo ${grupo.nombre}`);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Botón para agregar nuevo grupo */}
        <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            + Agregar Nuevo Grupo
          </button>
        </div>
      </div>
    </div>
  );
};