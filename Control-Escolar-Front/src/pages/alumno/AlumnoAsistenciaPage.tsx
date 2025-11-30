//src/pages/alumno/AlumnoAsistenciaPage.tsx
import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Importante
import{ UserHeaderIcons } from "../../components/layout/UserHeaderIcons";

/**
 * Página: AlumnoAsistenciaPage
 * Descripción: Muestra el calendario de asistencia, estadísticas y recordatorios del alumno.
 */
export const AlumnoAsistenciaPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ Hook de navegación

  const stats = [
    { label: "Asistencia", value: "90%" },
    { label: "Faltas", value: "1" },
    { label: "Retardos", value: "2" },
  ];

  const reminders = [
    "Entrega de proyecto de Física el viernes.",
    "Examen de Matemáticas el lunes 15.",
  ];

  return (
    <div className="main-content p-8 bg-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 font-[Kaushan Script]">
          Mi Asistencia
        </h1>
        <UserHeaderIcons />
      </header>

      {/* Sección Superior: Calendario + Estadísticas */}
      <section className="flex flex-wrap gap-6 mb-10">
        {/* Calendario */}
        <Card className="flex-1 min-w-[400px] p-6 shadow-sm">
          <div className="flex justify-between flex-wrap gap-4 mb-4">
            <div>
              <p className="text-lg font-semibold">Mon, Aug 17</p>
              <div className="flex items-center text-gray-700 font-bold">
                <ChevronLeft className="mx-2 cursor-pointer" size={18} />
                <span>August 2025</span>
                <ChevronRight className="mx-2 cursor-pointer" size={18} />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Faltas
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                Retardos
              </div>
            </div>
          </div>

          {/* Cuadrícula del calendario */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <span
                key={day}
                className="font-semibold text-gray-400 text-sm tracking-wide"
              >
                {day}
              </span>
            ))}

            {/* Días del mes (solo ejemplo visual) */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isAbsent = day === 17;
              const isLate = day === 5;

              return (
                <span
                  key={day}
                  className={`p-2 rounded-full cursor-pointer transition
                    ${isAbsent
                      ? "bg-red-500 text-white font-bold"
                      : isLate
                        ? "bg-yellow-400 text-gray-800 font-bold"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="flex flex-col gap-4 flex-1 min-w-[250px]">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="text-center p-4 shadow-sm flex flex-col justify-center"
            >
              <p className="text-gray-500 text-lg">{stat.label}</p>
              <h2 className="text-4xl font-bold text-gray-800">
                {stat.value}
              </h2>
            </Card>
          ))}
        </div>
      </section>

      {/* Sección Inferior: Recordatorios + Botón */}
      <section className="flex flex-wrap gap-6">
        {/* Recordatorios */}
        <Card className="flex-1 min-w-[400px] p-6 shadow-sm">
          <h2 className="text-2xl font-[Kaushan Script] mb-4">
            Recordatorios
          </h2>
          {reminders.map((reminder, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
            >
              <Bell className="text-gray-400 mr-3" size={20} />
              <p className="text-gray-500 text-sm">{reminder}</p>
            </div>
          ))}
        </Card>

        {/* Botón de detalles */}
        <div className="flex-1 flex justify-center items-end min-w-[250px]">
          <Button
            variant="secondary"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg px-8 py-4 shadow-md"
            onClick={() => navigate("/alumno/asistencia/detalles")} // ✅ Navega a detalles
          >
            Detalles de Asistencia
          </Button>
        </div>
      </section>
    </div>
  );
};
