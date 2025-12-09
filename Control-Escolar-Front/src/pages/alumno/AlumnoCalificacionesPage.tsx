// src/pages/alumno/AlumnoCalificacionesPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ChevronDown } from 'lucide-react';

// 🛑 IMPORTACIONES DE UI UNIFICADA
import { Card } from '../../components/ui/Card'; // Nombrada
// Importamos Table por defecto, y los subcomponentes nombrados
import Table, { TableHead, TableRow, TableCell } from '../../components/ui/Table';

// Importamos Hooks y Servicio
import { useAuth } from "../../hooks/useAuth";
import { getCalificacionesBoleta } from "../../services/alumno.service";
import type { BoletaCalificacion } from "../../services/alumno.service";

export const AlumnoCalificacionesPage: React.FC = () => {
  const { user } = useAuth();

  // Estados
  const periodosDisponibles = useMemo(() => ['2025-1', '2024-2', '2024-1'], []);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(periodosDisponibles[0]);
  const [calificaciones, setCalificaciones] = useState<BoletaCalificacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos (se envuelve en useCallback)
  const fetchData = useCallback(async (periodo: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // **IMPORTANTE:** Pasamos el periodo a la función de servicio
      const data = await getCalificacionesBoleta(user.id, periodo);
      setCalificaciones(data);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // useEffect inicial y para cambio de periodo
  useEffect(() => {
    fetchData(periodoSeleccionado);
  }, [periodoSeleccionado, fetchData]);

  // Handler para el cambio en el dropdown
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoSeleccionado(e.target.value);
  };

  // Cálculo del promedio (simulado)
  const promedioCalculado = useMemo(() => {
    const notasFinales = calificaciones
      .map(c => parseFloat(c.final))
      .filter(n => !isNaN(n));

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
          <Card
            className="bg-[#eff3f6] p-8 rounded-[3rem] shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-x-auto"
            variant="default" // Usamos default para la sombra y redondeo general
          >
            <div className="min-w-[700px]">

              {/* 🛑 APLICACIÓN DEL COMPONENTE TABLE */}
              <Table className="min-w-full">

                {/* ENCABEZADOS DE LA TABLA */}
                <Table.Header>
                  <TableHead colSpan={2} className="text-left pl-4 w-2/5">Materia</TableHead>
                  <TableHead className="text-center">U1</TableHead>
                  <TableHead className="text-center">U2</TableHead>
                  <TableHead className="text-center">U3</TableHead>
                  <TableHead className="text-center">U4</TableHead>
                  <TableHead className="text-center">U5</TableHead>
                  <TableHead className="text-center">Final</TableHead>
                </Table.Header>

                {/* FILAS DE DATOS DESDE EL SERVICIO */}
                <Table.Body>
                  {calificaciones.length > 0 ? (
                    calificaciones.map((fila, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white hover:bg-gray-50"
                      >
                        {/* Materia ocupa 2 columnas */}
                        <TableCell colSpan={2} className="font-bold text-gray-800 pl-4 truncate w-2/5">
                          {fila.materia}
                        </TableCell>
                        <TableCell className="text-center">{fila.u1}</TableCell>
                        <TableCell className="text-center">{fila.u2}</TableCell>
                        <TableCell className="text-center">{fila.u3}</TableCell>
                        <TableCell className="text-center">{fila.u4}</TableCell>
                        <TableCell className="text-center">{fila.u5}</TableCell>
                        {/* Celda Final con color negrita */}
                        <TableCell className="text-center font-bold text-black">{fila.final}</TableCell>
                      </Table.Row>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-gray-400 font-medium">No hay calificaciones registradas para el periodo **{periodoSeleccionado}**.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </Table.Body>
              </Table>

            </div>
          </Card> {/* Cierre del Card */}
        </div>

        {/* LADO DERECHO: PROMEDIO (Tarjeta) */}
        {/* 🛑 REFACTORIZADO: Usamos Card para el promedio flotante */}
        <Card className="lg:w-48 flex flex-col items-center justify-center pt-8 bg-[#f4f6f8]" variant="elevated">
          <h2 className="text-2xl font-bold text-gray-700 mb-1">Promedio</h2>
          <span className="text-7xl font-black text-black tracking-tighter">{promedioCalculado}</span>
        </Card>

      </div>
    </div>
  );
};