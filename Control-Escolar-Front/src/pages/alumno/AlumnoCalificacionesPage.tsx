// src/pages/alumno/AlumnoCalificacionesPage.tsx
import React from "react";
import "../../styles/styles.css";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";

export const AlumnoCalificacionesPage: React.FC = () => {
  const calificaciones = [
    { materia: "Matemáticas", u1: 8, u2: 9, u3: 9, u4: 8, u5: 9, final: 9 },
    { materia: "Programación Web", u1: 9, u2: 8, u3: 9, u4: 9, u5: 9, final: 9 },
    { materia: "Redes de Computadoras", u1: 8, u2: 8, u3: 8, u4: 9, u5: 9, final: 8.5 },
  ];

  return (
    <div className="main-content" style={{ background: "#f8f9fa", minHeight: "100vh", padding: "40px" }}>
      {/* Encabezado */}
      <header className="header">
        <h1 className="title">Mis Calificaciones</h1>
        <UserHeaderIcons />
      </header>

      {/* Filtro de periodo */}
      <section className="filter-section" style={{ marginTop: "20px" }}>
        <select>
          <option>Periodo</option>
          <option>2025-1</option>
          <option>2025-2</option>
        </select>
      </section>

      {/* Contenedor principal de la tabla y promedio */}
      <section className="grades-container" style={{ marginTop: "30px" }}>
        {/* Tabla */}
        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>Materia</th>
                <th>U1</th>
                <th>U2</th>
                <th>U3</th>
                <th>U4</th>
                <th>U5</th>
                <th>Final</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((fila, i) => (
                <tr key={i}>
                  <td>{fila.materia}</td>
                  <td>{fila.u1}</td>
                  <td>{fila.u2}</td>
                  <td>{fila.u3}</td>
                  <td>{fila.u4}</td>
                  <td>{fila.u5}</td>
                  <td>{fila.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Promedio */}
        <div className="average-box">
          <p>Promedio</p>
          <h2>
            {(
              calificaciones.reduce((acc, cur) => acc + cur.final, 0) /
              calificaciones.length
            ).toFixed(1)}
          </h2>
        </div>
      </section>
    </div>
  );
};
