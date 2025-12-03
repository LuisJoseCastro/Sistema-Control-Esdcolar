// src/pages/alumno/AlumnoCalificacionesPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // <-- Importamos useMemo y useCallback
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ChevronDown } from 'lucide-react'; // <-- Importamos icono

// Importamos Hooks y Servicio
import { useAuth } from "../../hooks/useAuth";
import { getCalificacionesBoleta } from "../../services/alumno.service";
import type { BoletaCalificacion } from "../../services/alumno.service";

export const AlumnoCalificacionesPage: React.FC = () => {
  const { user } = useAuth();

  // Estados
  const periodosDisponibles = useMemo(() => ['2025-1', '2024-2', '2024-1'], []); // Opciones disponibles
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(periodosDisponibles[0]); // Estado para el dropdown
  const [calificaciones, setCalificaciones] = useState<BoletaCalificacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos (se envuelve en useCallback)
  const fetchData = useCallback(async (periodo: string) => {
    if (!user?.id) return;
    setLoading(true); // Se inicia la carga
    try {
      // **IMPORTANTE:** Pasamos el periodo a la función de servicio
      const data = await getCalificacionesBoleta(user.id, periodo);
      setCalificaciones(data);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, [user]); // Depende solo de user

  // useEffect inicial y para cambio de periodo
  useEffect(() => {
    fetchData(periodoSeleccionado);
  }, [periodoSeleccionado, fetchData]); // Se dispara cuando el periodo cambia o al inicio

  // Handler para el cambio en el dropdown
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoSeleccionado(e.target.value);
  };

  // Cálculo del promedio (simulado)
  const promedioCalculado = useMemo(() => {
    const notasFinales = calificaciones
      .map(c => parseFloat(c.final))
      .filter(n => !isNaN(n)); // Filtra las notas que no son "---"

    if (notasFinales.length === 0) return '---';

    const suma = notasFinales.reduce((acc, nota) => acc + nota, 0);
    return (suma / notasFinales.length).toFixed(1);
  }, [calificaciones]);


  // Si está cargando, mostramos spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoadingSpinner text="Obteniendo boleta..." />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-full font-sans">

      {/* 1. ENCABEZADO */}
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

          {/* Dropdown (Periodo) - DINÁMICO */}
          <div className="mb-6 relative w-48">
            <select
              className="w-full appearance-none border border-gray-300 bg-white text-gray-500 rounded-lg px-4 py-2 shadow-sm focus:outline-none cursor-pointer"
              value={periodoSeleccionado}
              onChange={handlePeriodoChange}
              disabled={loading}
            >
              {periodosDisponibles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* CONTENEDOR GRIS CON SOMBRA FUERTE */}
          <div className="bg-[#eff3f6] p-8 rounded-4xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-x-auto">

            <div className="min-w-[700px]">

              {/* ENCABEZADOS DE LA TABLA */}
              <div className="grid grid-cols-8 gap-4 px-6 mb-4 text-gray-600 font-semibold text-sm">
                <div className="col-span-2 text-left pl-4">Materia</div>
                <div className="text-center">U1</div>
                <div className="text-center">U2</div>
                <div className="text-center">U3</div>
                <div className="text-center">U4</div>
                <div className="text-center">U5</div>
                <div className="text-center">Final</div>
              </div>

              {/* FILAS DE DATOS DESDE EL SERVICIO */}
              <div className="space-y-3">
                {calificaciones.length > 0 ? (
                  calificaciones.map((fila, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-8 gap-4 bg-white rounded-full py-4 px-6 shadow-sm items-center text-sm text-gray-600 whitespace-nowrap hover:shadow-md transition-shadow"
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 font-medium">No hay calificaciones registradas para el periodo **{periodoSeleccionado}**.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* LADO DERECHO: PROMEDIO (Texto flotante) */}
        <div className="lg:w-48 flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-1">Promedio</h2>
          <span className="text-7xl font-black text-black tracking-tighter">{promedioCalculado}</span>
        </div>

      </div>
    </div>
  );
};