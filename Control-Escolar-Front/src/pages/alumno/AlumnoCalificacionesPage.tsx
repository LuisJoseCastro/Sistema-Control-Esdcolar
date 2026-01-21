// src/pages/alumno/AlumnoCalificacionesPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ChevronDown, AlertCircle } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import Table, { TableHead, TableRow, TableCell } from '../../components/ui/Table';

import { useAuth } from "../../hooks/useAuth";
import { getCalificacionesBoleta, getPeriodosAlumno } from "../../services/alumno.service"; // <--- Importamos getPeriodosAlumno
import type { BoletaCalificacion } from "../../services/alumno.service";

export const AlumnoCalificacionesPage: React.FC = () => {
  const { user } = useAuth();

  // Estados
  const [periodosDisponibles, setPeriodosDisponibles] = useState<string[]>([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
  const [calificaciones, setCalificaciones] = useState<BoletaCalificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // 1. Cargar Periodos al montar
  useEffect(() => {
    const init = async () => {
      if (!user?.id) return;
      try {
        const periodos = await getPeriodosAlumno(user.id);
        if (periodos.length > 0) {
          setPeriodosDisponibles(periodos);
          setPeriodoSeleccionado(periodos[0]); // Seleccionar el más reciente por defecto
        } else {
          // Fallback si no hay periodos
          setPeriodosDisponibles(['2025-1']);
          setPeriodoSeleccionado('2025-1');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  // 2. Cargar Calificaciones cuando cambia el periodo
  useEffect(() => {
    const fetchGrades = async () => {
      if (!user?.id || !periodoSeleccionado) return;
      setLoadingGrades(true);
      try {
        const data = await getCalificacionesBoleta(user.id, periodoSeleccionado);
        setCalificaciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, [user, periodoSeleccionado]);

  // Handler para el cambio en el dropdown
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoSeleccionado(e.target.value);
  };

  // Cálculo del promedio
  const promedioCalculado = useMemo(() => {
    const notasFinales = calificaciones
      .map(c => parseFloat(c.final))
      .filter(n => !isNaN(n) && n > 0); // Solo contamos notas > 0

    if (notasFinales.length === 0) return '---';

    const suma = notasFinales.reduce((acc, nota) => acc + nota, 0);
    return (suma / notasFinales.length).toFixed(1);
  }, [calificaciones]);

  if (loading) {
    return <div className="flex justify-center mt-20"><LoadingSpinner text="Cargando ciclos escolares..." /></div>;
  }

  return (
    <div className="p-8 bg-white min-h-full font-sans">

      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Mis Calificaciones
        </h1>
        <div className="mb-2"><UserHeaderIcons /></div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* LADO IZQUIERDO: Filtro y Tabla */}
        <div className="flex-1 w-full">

          {/* Dropdown DINÁMICO */}
          <div className="mb-6 relative w-48">
            <select
              className="w-full appearance-none border border-gray-300 bg-white text-gray-700 font-medium rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={periodoSeleccionado}
              onChange={handlePeriodoChange}
            >
              {periodosDisponibles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          <Card className="bg-[#eff3f6] p-8 rounded-[3rem] shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-x-auto" variant="default">
            <div className="min-w-[700px]">
              {loadingGrades ? (
                <div className="py-10 flex justify-center"><LoadingSpinner text="Consultando boleta..." /></div>
              ) : (
                <Table className="min-w-full">
                  <Table.Header>
                    <Table.Row>
                      <TableHead colSpan={2} className="text-left pl-4 w-2/5 text-gray-600 font-bold uppercase text-sm">Materia</TableHead>
                      <TableHead className="text-center text-gray-600 font-bold uppercase text-sm">P1</TableHead>
                      <TableHead className="text-center text-gray-600 font-bold uppercase text-sm">P2</TableHead>
                      <TableHead className="text-center text-gray-600 font-bold uppercase text-sm">P3</TableHead>
                      <TableHead className="text-center text-gray-400 font-normal uppercase text-xs">EXTRA</TableHead>
                      <TableHead className="text-center text-black font-extrabold uppercase text-sm bg-gray-200 rounded-t-lg">Final</TableHead>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {calificaciones.length > 0 ? (
                      calificaciones.map((fila, index) => (
                        <Table.Row key={index} className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                          <TableCell colSpan={2} className="font-bold text-gray-700 pl-4 py-4 w-2/5">
                            {fila.materia}
                          </TableCell>
                          <TableCell className="text-center text-gray-600">{fila.u1}</TableCell>
                          <TableCell className="text-center text-gray-600">{fila.u2}</TableCell>
                          <TableCell className="text-center text-gray-600">{fila.u3}</TableCell>
                          <TableCell className="text-center text-gray-400">-</TableCell>
                          <TableCell className="text-center font-black text-lg text-black bg-gray-50 border-l border-gray-200">
                            {fila.final}
                          </TableCell>
                        </Table.Row>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center text-gray-400 gap-2">
                            <AlertCircle size={32} />
                            <p className="font-medium">No hay calificaciones registradas para {periodoSeleccionado}.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Table.Body>
                </Table>
              )}
            </div>
          </Card>
        </div>

        {/* LADO DERECHO: PROMEDIO */}
        <Card className="lg:w-48 flex flex-col items-center justify-center pt-8 pb-8 bg-[#f4f6f8]" variant="elevated">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Promedio</h2>
          <span className={`text-6xl font-black tracking-tighter ${Number(promedioCalculado) >= 8 || promedioCalculado === '---' ? 'text-gray-800' : 'text-orange-500'}`}>
            {promedioCalculado}
          </span>
          <p className="text-xs text-gray-400 mt-2">del periodo</p>
        </Card>

      </div>
    </div>
  );
};