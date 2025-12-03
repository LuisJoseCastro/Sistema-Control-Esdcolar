import React, { useState } from 'react';
import { UserHeaderIcons } from '../../components/layout/UserHeaderIcons';
import { Search, CalendarDays, Clock, User } from 'lucide-react'; 

// 1. ESTRUCTURA DE DATOS ACTUALIZADA (Array de horarios)
const asignaturasMock = [
  { 
    id: 1, 
    materia: 'Matemáticas', 
    profesor: 'Ing. Pérez',
    horarios: [
        { dia: 'Lunes', hora: '08:00 - 10:00' },
        { dia: 'Miércoles', hora: '10:00 - 12:00' }
    ]
  },
  { 
    id: 2, 
    materia: 'Programación Web', 
    profesor: 'Lic. García',
    horarios: [
        { dia: 'Martes', hora: '07:00 - 09:00' },
        { dia: 'Jueves', hora: '07:00 - 09:00' },
        { dia: 'Viernes', hora: '08:00 - 10:00' } // Ejemplo con 3 horarios
    ]
  },
  { 
    id: 3, 
    materia: 'Base de Datos', 
    profesor: 'Ing. López',
    horarios: [
        { dia: 'Viernes', hora: '12:00 - 14:00' } // Solo 1 horario
    ]
  },
];

export const AlumnoAsignaturasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 bg-white min-h-full font-sans">
      
      <header className="flex justify-between items-end border-b-2 border-black pb-2 mb-8">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Mis Asignaturas
        </h1>
        <div className="mb-2">
           <UserHeaderIcons />
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4">
          <div className="relative w-full md:w-80 mb-4 md:mb-0">
              <input 
                  type="text" 
                  placeholder="Buscar asignatura..." 
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div>
              <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-500 bg-white shadow-sm focus:outline-none cursor-pointer w-40">
                  <option>Semestre</option>
                  <option>1°</option>
                  <option>2°</option>
              </select>
          </div>
      </div>

      <div className="bg-[#eff3f6] p-8 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.15)] min-h-[500px]">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-8 mb-4 text-gray-500 font-bold text-sm uppercase tracking-wider">
              <div className="text-left pl-2">Materia</div>
              <div className="text-center md:col-span-2">Horario</div>
              <div className="text-right pr-4">Profesor</div>
          </div>

          <div className="space-y-4">
              {asignaturasMock.map((item) => (
                  <div 
                      key={item.id}
                      // 'items-center' asegura que todo esté centrado verticalmente aunque la fila crezca de alto
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-4xl py-4 px-8 shadow-sm items-center text-sm md:text-base text-gray-600 hover:shadow-md transition-all hover:-translate-y-1 duration-200"
                  >
                      {/* COLUMNA 1: Materia */}
                      <div className="font-bold text-gray-800 truncate text-lg">
                          {item.materia}
                      </div>
                      
                      {/* COLUMNA 2 y 3: Horarios Multiples */}
                      <div className="md:col-span-2 flex flex-col items-center gap-2">
                          {/* Mapeamos cada horario de la lista */}
                          {item.horarios.map((horario, index) => (
                              <div key={index} className="flex items-center gap-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 w-fit">
                                  {/* Día */}
                                  <div className="flex items-center gap-2 text-blue-600 font-semibold w-24 justify-end">
                                      <span>{horario.dia}</span>
                                      <CalendarDays size={14} />
                                  </div>
                                  
                                  {/* Separador */}
                                  <div className="w-px h-3 bg-gray-300"></div>
                                  
                                  {/* Hora */}
                                  <div className="flex items-center gap-2 text-gray-500 text-sm w-28">
                                      <Clock size={14} />
                                      <span>{horario.hora}</span>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* COLUMNA 4: Profesor */}
                      <div className="flex justify-end items-center gap-2 text-gray-600 font-medium truncate">
                          <span className="truncate">{item.profesor}</span>
                          <div className="p-1.5 bg-gray-100 rounded-full">
                             <User size={16} className="text-gray-400"/>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

      </div>

    </div>
  );
};