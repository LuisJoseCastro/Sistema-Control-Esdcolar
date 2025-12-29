import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types/models';

// === Páginas públicas ===
import { PlansPage } from '../pages/public/PlansPage';
import { OnboardingPage } from '../pages/public/OnboardingPage';
import { LoginPageGeneral } from '../pages/public/LoginPageGeneral';
import { RegisterSchoolPage } from '../pages/public/RegisterSchoolPage'; // ✅ IMPORTACIÓN NUEVA

// === Layout principal ===
import { AppLayout } from '../components/layout/AppLayout';

// === Dashboards principales y vistas del ADMINISTRADOR ===
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminAlumnosPage } from '../pages/admin/AdminAlumnosPage';
import { AdminListaAlumnosPage } from '../pages/admin/AdminListaAlumnosPage';
import { AdminPerfilAlumnoPage } from '../pages/admin/AdminPerfilAlumnoPage';
import { AdminHistorialAcademicoPage } from '../pages/admin/AdminHistorialAcademicoPage';
import { AdminDocentesPage } from '../pages/admin/AdminDocentesPage';
import { AdminDocenteProfilePage } from '../pages/admin/AdminDocenteProfilePage';
import AdminMensajesPage from '../pages/admin/AdminMensajesPage'; 
import AdminGestionPage from '../pages/admin/AdminGestionPage'; 
import AdminReportesPage from '../pages/admin/AdminReportesPage'; 

// === Vistas del docente ===
import DocenteDashboardPage from '../pages/docente/DocenteDashboardPage';
import { DocenteAsistenciaPage } from '../pages/docente/DocenteAsistenciaPage';
import { DocenteCalificacionesPage } from '../pages/docente/DocenteCalificacionesPage';
import { DocenteMensajesPage } from '../pages/docente/DocenteMensajesPage';
import DocenteGruposPage from '../pages/docente/DocenteGruposPage';
import DocenteReportesPage from '../pages/docente/DocenteReportesPage';
import DocentePerfilPage from '../pages/docente/DocentePerfilPage';

// === Vistas del alumno ===
import { AlumnoDashboardPage } from '../pages/alumno/AlumnoDashboardPage';
import { AlumnoAsignaturasPage } from '../pages/alumno/AlumnoAsignaturasPage';
import { AlumnoCalificacionesPage } from '../pages/alumno/AlumnoCalificacionesPage';
import { AlumnoAsistenciaPage } from '../pages/alumno/AlumnoAsistenciaPage';
import { AlumnoAsistenciaDetallesPage } from '../pages/alumno/AlumnoAsistenciaDetallesPage';
import { AlumnoHistorialAcademicoPage } from '../pages/alumno/AlumnoHistorialAcademicoPage'; // ✅ CORREGIDO (Sin error de dedo)
import { AlumnoMensajesPage } from '../pages/alumno/AlumnoMensajesPage';
import { AlumnoPerfilPage } from '../pages/alumno/AlumnoPerfilPage';
import { AlumnoDocumentosPage } from '../pages/alumno/AlumnoDocumentosPage';

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
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<PlansPage />} /> 
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPageGeneral />} />
        
        {/* ✅ NUEVA RUTA DE REGISTRO DE ESCUELA */}
        <Route path="/register-school" element={<RegisterSchoolPage />} />

        {/* Redirecciones rápidas */}
        <Route path="/acceso" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/docente/login" element={<Navigate to="/login" replace />} />
        <Route path="/alumno/login" element={<Navigate to="/login" replace />} />

        {/* RUTAS PROTEGIDAS (Requieren Login y Layout) */}
        <Route element={<AppLayout />}>
          
          {/* SECCIÓN ADMINISTRADOR */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> 
            <Route path="/admin/docentes" element={<AdminDocentesPage />} />
            <Route path="/admin/mensajes" element={<AdminMensajesPage />} /> 
            <Route path="/admin/plan-estudios" element={<AdminGestionPage />} /> 
            <Route path="/admin/reportes" element={<AdminReportesPage />} /> 
            <Route path="/admin/alumnos" element={<AdminAlumnosPage />} />
            <Route path="/admin/alumnos/:grupoId" element={<AdminListaAlumnosPage />} />
            <Route path="/admin/alumnos/:grupoId/:alumnoId/perfil" element={<AdminPerfilAlumnoPage />} />
            <Route path="/admin/alumnos/:grupoId/:alumnoId/historial" element={<AdminHistorialAcademicoPage />} />
            <Route path="/admin/docentes/:id/perfil" element={<AdminDocenteProfilePage />} />
          </Route>

          {/* SECCIÓN DOCENTE */}
          <Route element={<PrivateRoute allowedRoles={['DOCENTE']} />}>
            <Route path="/docente/dashboard" element={<DocenteDashboardPage />} />
            <Route path="/docente/asistencia" element={<DocenteAsistenciaPage />} />
            <Route path="/docente/calificaciones" element={<DocenteCalificacionesPage />} />
            <Route path="/docente/mensajes" element={<DocenteMensajesPage />} />
            <Route path="/docente/grupos" element={<DocenteGruposPage />} />
            <Route path="/docente/reportes" element={<DocenteReportesPage />} />
            <Route path="/docente/perfil" element={<DocentePerfilPage />} />
          </Route>

          {/* SECCIÓN ALUMNO */}
          <Route element={<PrivateRoute allowedRoles={['ALUMNO']} />}>
            <Route path="/alumno/dashboard" element={<AlumnoDashboardPage />} />
            <Route path="/alumno/asignaturas" element={<AlumnoAsignaturasPage />} />
            <Route path="/alumno/calificaciones" element={<AlumnoCalificacionesPage />} />
            <Route path="/alumno/asistencia" element={<AlumnoAsistenciaPage />} />
            <Route path="/alumno/mensajes" element={<AlumnoMensajesPage />} />
            <Route path="/alumno/asistencia/detalles" element={<AlumnoAsistenciaDetallesPage />} />
            {/* ✅ CORREGIDO: historial-academico */}
            <Route path="/alumno/historial-academico" element={<AlumnoHistorialAcademicoPage />} />
            <Route path="/alumno/perfil" element={<AlumnoPerfilPage />} />
            <Route path="/alumno/documentos-pagos" element={<AlumnoDocumentosPage />} />
          </Route>
        </Route>

        {/* 404 - No Encontrado */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">404 | Página no encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};