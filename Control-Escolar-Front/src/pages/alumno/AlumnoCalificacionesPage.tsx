//src/pages/alumno/AlumnoCalificacionesPage.tsx
import React from "react";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";

// Datos simulados
const calificaciones = [
  { materia: "Matemáticas", u1: "10", u2: "9", u3: "10", u4: "---", u5: "---", final: "---" },
  { materia: "Física", u1: "8", u2: "8", u3: "9", u4: "---", u5: "---", final: "---" },
  { materia: "Química", u1: "9", u2: "9", u3: "9", u4: "---", u5: "---", final: "---" },
];

export const AlumnoCalificacionesPage: React.FC = () => {
  return (
    <div className="p-8 bg-white min-h-full font-sans">
      
      {/* 1. ENCABEZADO (Igual a la imagen: Cursiva y línea abajo) */}
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Mis Calificaciones
        </h1>
        <div className="mb-2">
           <UserHeaderIcons />
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LADO IZQUIERDO: Filtro y Tabla */}
        <div className="flex-1 w-full">
            
            {/* Dropdown (Periodo) */}
            <div className="mb-6">
                <select className="border border-gray-300 bg-white text-gray-500 rounded-lg px-4 py-2 w-48 shadow-sm focus:outline-none cursor-pointer">
                    <option>2025-1</option>
                    <option>2024-2</option>
                </select>
            </div>

            {/* CONTENEDOR GRIS CON SOMBRA FUERTE */}
            <div className="bg-[#eff3f6] p-8 rounded-4xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-x-auto">
                
                {/* --- AQUÍ ESTABA EL ERROR, AHORA CORREGIDO --- */}
                {/* Usamos min-w-[700px] para que no se apachurre en pantallas chicas */}
                <div className="min-w-[700px]">

                    {/* ENCABEZADOS DE LA TABLA */}
                    {/* CAMBIO: grid-cols-8 (2 para materia + 6 calificaciones = 8) */}
                    <div className="grid grid-cols-8 gap-4 px-6 mb-4 text-gray-600 font-semibold text-sm">
                        <div className="col-span-2 text-left pl-4">Materia</div>
                        <div className="text-center">U1</div>
                        <div className="text-center">U2</div>
                        <div className="text-center">U3</div>
                        <div className="text-center">U4</div>
                        <div className="text-center">U5</div>
                        <div className="text-center">Final</div>
                    </div>

                    {/* FILAS DE DATOS */}
                    <div className="space-y-3">
                        {calificaciones.map((fila, index) => (
                            <div 
                                key={index} 
                                // CAMBIO: grid-cols-8 aquí también para que coincida con el encabezado
                                className="grid grid-cols-8 gap-4 bg-white rounded-full py-4 px-6 shadow-sm items-center text-sm text-gray-600 whitespace-nowrap"
                            >
                                {/* Materia ocupa 2 columnas */}
                                <div className="col-span-2 font-bold text-gray-800 pl-4 truncate">
                                    {fila.materia}
                                </div>
                                <div className="text-center">{fila.u1}</div>
                                <div className="text-center">{fila.u2}</div>
                                <div className="text-center">{fila.u3}</div>
                                <div className="text-center">{fila.u4}</div>
                                <div className="text-center">{fila.u5}</div>
                                <div className="text-center font-bold text-black">{fila.final}</div>
                            </div>
                        ))}
                        
                        {/* Filas vacías para estética (relleno visual) */}
                        {[...Array(3)].map((_, i) => (
                             <div key={`empty-${i}`} className="grid grid-cols-8 gap-4 bg-white rounded-full py-4 px-6 shadow-sm h-12 opacity-40">
                             </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>

        {/* LADO DERECHO: PROMEDIO (Texto flotante) */}
        <div className="lg:w-48 flex flex-col items-center justify-center pt-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-1">Promedio</h2>
            <span className="text-7xl font-black text-black tracking-tighter">8.5</span>
        </div>

      </div>
    </div>
  );
};