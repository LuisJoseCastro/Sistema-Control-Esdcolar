//src/pages/alumno/AlumnoAsistenciaDetallesPage.tsx
import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";

/**
 * Página: AlumnoAsistenciaDetallesPage
 * Descripción: Muestra el historial detallado de asistencias del alumno.
 */
export const AlumnoAsistenciaDetallesPage: React.FC = () => {
  const navigate = useNavigate();

  // Datos simulados (puedes reemplazar con fetch/API)
  const asistencias = [
    { fecha: "2025-11-01", materia: "Matemáticas", estado: "Falta" },
    { fecha: "2025-11-02", materia: "Física", estado: "Retardo" },
    { fecha: "2025-11-03", materia: "Historia", estado: "Falta" },
    { fecha: "2025-11-04", materia: "Inglés", estado: "Retardo" },
    { fecha: "2025-11-05", materia: "Química", estado: "Retardo" },
  ];

  // Clases según el estado
  const getEstadoClase = (estado: string) => {
    if (estado === "Falta")
      return "bg-red-100 text-red-600 border border-red-500 font-semibold";
    if (estado === "Retardo")
      return "bg-yellow-100 text-yellow-600 border border-yellow-500 font-semibold";
    return "bg-green-100 text-green-600 border border-green-500 font-semibold";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-xl p-8 shadow-lg bg-white">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-[Kaushan Script] text-gray-800">
            Detalles de Asistencia
            <UserHeaderIcons />
          </h1>
        </header>

        {/* Tabla */}
        <section className="space-y-3 mb-8">
          <div className="grid grid-cols-3 gap-4 bg-gray-100 px-4 py-3 rounded-md font-semibold text-gray-700">
            <div className="text-center">Fecha</div>
            <div className="text-center">Materia</div>
            <div className="text-center">Estado</div>
          </div>

          {asistencias.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 items-center border-b border-gray-200 py-3"
            >
              <div className="text-center text-gray-700">{item.fecha}</div>
              <div className="text-center text-gray-700">{item.materia}</div>
              <div
                className={`text-center rounded-full px-3 py-1 text-sm ${getEstadoClase(
                  item.estado
                )}`}
              >
                {item.estado}
              </div>
            </div>
          ))}
        </section>

        {/* Botón volver */}
        <div className="pt-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-[#2E4156] hover:bg-[#3a516b] text-white font-semibold py-3 rounded-lg"
            onClick={() => navigate("/alumno/asistencia")}
          >
            Volver
          </Button>
        </div>
      </Card>
    </div>
  );
};
