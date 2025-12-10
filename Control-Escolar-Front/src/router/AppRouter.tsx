//src/router/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types/models';

// === Páginas públicas ===
//import { LandingPage } from '../pages/public/LandingPage';
import { OnboardingPage } from '../pages/public/OnboardingPage';
import { LoginPageGeneral } from '../pages/public/LoginPageGeneral';

// === Layout principal ===
import { AppLayout } from '../components/layout/AppLayout';

// === Dashboards principales ===
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import DocenteDashboardPage  from '../pages/docente/DocenteDashboardPage';
import { AlumnoDashboardPage } from '../pages/alumno/AlumnoDashboardPage';

// === Vistas adicionales del alumno ===
import { AlumnoAsignaturasPage } from '../pages/alumno/AlumnoAsignaturasPage';
import { AlumnoCalificacionesPage } from '../pages/alumno/AlumnoCalificacionesPage';
import { AlumnoAsistenciaPage } from '../pages/alumno/AlumnoAsistenciaPage';
import { AlumnoAsistenciaDetallesPage } from '../pages/alumno/AlumnoAsistenciaDetallesPage';
import { AlumnoHistorialAcademicoPage } from '../pages/alumno/AlumnoHistorialAcademicoPage';
import { AlumnoMensajesPage } from '../pages/alumno/AlumnoMensajesPage';
import { AlumnoPerfilPage } from '../pages/alumno/AlumnoPerfilPage';
import { AlumnoDocumentosPage } from '../pages/alumno/AlumnoDocumentosPage';

import { DocenteAsistenciaPage } from '../pages/docente/DocenteAsistenciaPage';
import { DocenteCalificacionesPage } from '../pages/docente/DocenteCalificacionesPage';
import { DocenteMensajesPage } from '../pages/docente/DocenteMensajesPage';


import { AdminDocentesPage } from '../pages/admin/AdminDocentesPage';

// === PrivateRoute: protege rutas según el rol ===
const PrivateRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes((role ?? 'ALUMNO') as Role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl text-red-600">403 | Acceso Denegado</h1>
      </div>
    );
  }

  return <Outlet />;
};

// === Configuración principal de rutas ===
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÚBLICAS */}
        {/* 1. REDIRECCIÓN DE RUTA RAÍZ A LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPageGeneral />} /> // Usamos el login SaaS

        {/* Redirecciones */}
        <Route path="/acceso" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/docente/login" element={<Navigate to="/login" replace />} />
        <Route path="/alumno/login" element={<Navigate to="/login" replace />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<AppLayout />}>
          {/* ADMIN */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> 
            <Route path="/admin/docentes" element={<AdminDocentesPage />} />
          </Route>

          {/* DOCENTE */}
          <Route element={<PrivateRoute allowedRoles={['DOCENTE']} />}>
            <Route path="/docente/dashboard" element={<DocenteDashboardPage />} />
            <Route path="/docente/asistencia" element={<DocenteAsistenciaPage />} />
            <Route path="/docente/calificaciones" element={<DocenteCalificacionesPage />} />
            <Route path="/docente/mensajes" element={<DocenteMensajesPage />} />

          </Route>

          {/* ALUMNO */}
          <Route element={<PrivateRoute allowedRoles={['ALUMNO']} />}>
            <Route path="/alumno/dashboard" element={<AlumnoDashboardPage />} />
            <Route path="/alumno/asignaturas" element={<AlumnoAsignaturasPage />} />
            <Route path="/alumno/calificaciones" element={<AlumnoCalificacionesPage />} />
            <Route path="/alumno/asistencia" element={<AlumnoAsistenciaPage />} />
            <Route path="/alumno/mensajes" element={<AlumnoMensajesPage />} />

            <Route path="/alumno/asistencia/detalles" element={<AlumnoAsistenciaDetallesPage />} />
            <Route path="/alumno/historial-academico" element={<AlumnoHistorialAcademicoPage />} />
            <Route path="/alumno/perfil" element={<AlumnoPerfilPage />} />

            <Route path="/alumno/documentos-pagos" element={<AlumnoDocumentosPage />} />


          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};
  