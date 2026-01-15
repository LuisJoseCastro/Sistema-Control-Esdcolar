import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ChevronDown } from 'lucide-react';

// 🛑 UI UNIFICADA
import { Card } from '../../components/ui/Card'; 
import Table, { TableRow, TableCell, TableHead } from '../../components/ui/Table';

// Hooks y Servicios
import { useAuth } from "../../hooks/useAuth";
import { getCalificacionesBoleta, getPeriodosDisponibles } from "../../services/alumno.service";
import type { BoletaCalificacion } from "../../services/alumno.service";

export const AlumnoCalificacionesPage: React.FC = () => {
  const { user } = useAuth();

  // --- ESTADOS ---
  const [periodosDisponibles, setPeriodosDisponibles] = useState<string[]>([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("");
  const [calificaciones, setCalificaciones] = useState<BoletaCalificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  // --- 1. CARGA INICIAL DE PERIODOS ---
  useEffect(() => {
    const cargarConfiguracionInicial = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const periodos = await getPeriodosDisponibles(user.id);
        setPeriodosDisponibles(periodos);
        
        if (periodos.length > 0) {
          setPeriodoSeleccionado(periodos[0]); 
        }
      } catch (error) {
        console.error("Error al obtener periodos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarConfiguracionInicial();
  }, [user?.id]);

  // --- 2. FUNCIÓN PARA CARGAR CALIFICACIONES ---
  const fetchData = useCallback(async (periodo: string) => {
    if (!user?.id || !periodo) return;
    setLoadingTable(true);
    try {
      const data = await getCalificacionesBoleta(user.id, periodo);
      setCalificaciones(data);
    } catch (error) {
      console.error("Error cargando calificaciones:", error);
      setCalificaciones([]);
    } finally {
      setLoadingTable(false);
    }
  }, [user?.id]);

  // --- 3. EFECTO AL CAMBIAR EL PERIODO ---
  useEffect(() => {
    if (periodoSeleccionado) {
      fetchData(periodoSeleccionado);
    }
  }, [periodoSeleccionado, fetchData]);

  // --- HANDLERS ---
  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodoSeleccionado(e.target.value);
  };

  // --- CÁLCULO DE PROMEDIO ---
  const promedioCalculado = useMemo(() => {
    const notasFinales = calificaciones
      .map(c => parseFloat(c.final))
      .filter(n => !isNaN(n));

    if (notasFinales.length === 0) return '---';

    const suma = notasFinales.reduce((acc, nota) => acc + nota, 0);
    return (suma / notasFinales.length).toFixed(1);
  }, [calificaciones]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <LoadingSpinner text="Sincronizando periodos..." />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-full font-sans">
      <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-10">
        <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
          Mis Calificaciones
        </h1>
        <div className="mb-2">
          <UserHeaderIcons />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          
          <div className="mb-6 relative w-48">
            <select
              className="w-full appearance-none border border-gray-300 bg-white text-gray-500 rounded-lg px-4 py-2 shadow-sm focus:outline-none cursor-pointer disabled:bg-gray-100"
              value={periodoSeleccionado}
              onChange={handlePeriodoChange}
              disabled={loadingTable}
            >
              {periodosDisponibles.length > 0 ? (
                periodosDisponibles.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))
              ) : (
                <option value="">No hay periodos</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          <Card className="bg-[#eff3f6] p-8 rounded-[3rem] shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-x-auto">
            <div className="min-w-[700px]">
              {loadingTable ? (
                <div className="py-20 flex justify-center">
                  <LoadingSpinner text="Actualizando boleta..." />
                </div>
              ) : (
                <Table className="min-w-full">
                  <Table.Header>
                    {/* Corrección de Testing: Se incluye Table.Row dentro de Header */}
                    <Table.Row>
                      <TableHead colSpan={2} className="text-left pl-4 w-2/5 text-gray-600">Materia</TableHead>
                      <TableHead className="text-center text-gray-600">U1</TableHead>
                      <TableHead className="text-center text-gray-600">U2</TableHead>
                      <TableHead className="text-center text-gray-600">U3</TableHead>
                      <TableHead className="text-center text-gray-600">U4</TableHead>
                      <TableHead className="text-center text-gray-600">U5</TableHead>
                      <TableHead className="text-center text-gray-600 font-bold">Final</TableHead>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {calificaciones.length > 0 ? (
                      calificaciones.map((fila, index) => (
                        <Table.Row key={index} className="bg-white hover:bg-gray-50 transition-colors">
                          <TableCell colSpan={2} className="font-bold text-gray-800 pl-4 truncate w-2/5">
                            {fila.materia}
                          </TableCell>
                          <TableCell className="text-center">{fila.u1}</TableCell>
                          <TableCell className="text-center">{fila.u2}</TableCell>
                          <TableCell className="text-center">{fila.u3}</TableCell>
                          <TableCell className="text-center">{fila.u4}</TableCell>
                          <TableCell className="text-center">{fila.u5}</TableCell>
                          <TableCell className="text-center font-bold text-black">{fila.final}</TableCell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row>
                        <TableCell colSpan={8} className="text-center py-12 text-gray-400 italic">
                          No se encontraron registros para el periodo {periodoSeleccionado}
                        </TableCell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              )}
            </div>
          </Card>
        </div>

        <Card className="lg:w-48 flex flex-col items-center justify-center py-8 bg-[#f4f6f8] border-none" variant="elevated">
          <h2 className="text-2xl font-bold text-gray-700 mb-1">Promedio</h2>
          <span className="text-7xl font-black text-black tracking-tighter">
            {loadingTable ? "..." : promedioCalculado}
          </span>
        </Card>
      </div>
    </div>
  );
};