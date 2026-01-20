import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types/models';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// === Páginas públicas ===
import { PlansPage } from '../pages/public/PlansPage';
import { OnboardingPage } from '../pages/public/OnboardingPage';
import { LoginPageGeneral } from '../pages/public/LoginPageGeneral';
import { RegisterSchoolPage } from '../pages/public/RegisterSchoolPage';
import { RegisterSchoolProPage } from '../pages/public/RegisterSchoolProPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';

// === Layout ===
import { AppLayout } from '../components/layout/AppLayout';

// === Dashboards y Admin ===
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

// === Docente ===
import DocenteDashboardPage from '../pages/docente/DocenteDashboardPage';
import { DocenteAsistenciaPage } from '../pages/docente/DocenteAsistenciaPage';
import { DocenteCalificacionesPage } from '../pages/docente/DocenteCalificacionesPage';
import { DocenteMensajesPage } from '../pages/docente/DocenteMensajesPage';
import DocenteGruposPage from '../pages/docente/DocenteGruposPage';
import DocenteReportesPage from '../pages/docente/DocenteReportesPage';
import DocentePerfilPage from '../pages/docente/DocentePerfilPage';

// === Alumno ===
import { AlumnoDashboardPage } from '../pages/alumno/AlumnoDashboardPage';
import { AlumnoAsignaturasPage } from '../pages/alumno/AlumnoAsignaturasPage';
import { AlumnoCalificacionesPage } from '../pages/alumno/AlumnoCalificacionesPage';
import { AlumnoAsistenciaPage } from '../pages/alumno/AlumnoAsistenciaPage';
import { AlumnoAsistenciaDetallesPage } from '../pages/alumno/AlumnoAsistenciaDetallesPage';
import { AlumnoHistorialAcademicoPage } from '../pages/alumno/AlumnoHistorialAcademicoPage';
import { AlumnoMensajesPage } from '../pages/alumno/AlumnoMensajesPage';
import { AlumnoPerfilPage } from '../pages/alumno/AlumnoPerfilPage';
import { AlumnoDocumentosPage } from '../pages/alumno/AlumnoDocumentosPage';

// === PrivateRoute: LÓGICA DE PROTECCIÓN ===
const PrivateRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { isLoggedIn, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner className="w-12 h-12 text-teal-600 mb-4" />
        <p className="text-gray-500 font-medium">Cargando sesión...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!allowedRoles.includes((role ?? 'ALUMNO') as Role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl text-red-600">403 | Acceso Denegado</h1>
      </div>
    );
  }

  return <Outlet />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={<PlansPage />} /> 
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPageGeneral />} />
        <Route path="/register-school" element={<RegisterSchoolPage />} />
        <Route path="/register-school-pro" element={<RegisterSchoolProPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/recovery" element={<ResetPasswordPage />} />

        {/* --- REDIRECTS --- */}
        <Route path="/acceso" element={<Navigate to="/login" replace />} />

        {/* --- RUTAS PROTEGIDAS CON LAYOUT --- */}
        <Route element={<AppLayout />}>
          
          {/* SECCIÓN ADMINISTRADOR */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> 
            
            {/* ✅ Rutas de Grupos y Alumnos corregidas */}
            <Route path="/admin/grupos" element={<AdminAlumnosPage />} /> 
            <Route path="/admin/alumnos" element={<AdminAlumnosPage />} />
            <Route path="/admin/alumnos/:grupoId" element={<AdminListaAlumnosPage />} />
            <Route path="/admin/alumnos/:grupoId/:alumnoId/perfil" element={<AdminPerfilAlumnoPage />} />
            <Route path="/admin/alumnos/:grupoId/:alumnoId/historial" element={<AdminHistorialAcademicoPage />} />
            
            {/* ✅ Rutas de Docentes */}
            <Route path="/admin/docentes" element={<AdminDocentesPage />} />
            <Route path="/admin/docentes/:id/perfil" element={<AdminDocenteProfilePage />} />
            
            {/* ✅ Otras herramientas */}
            <Route path="/admin/mensajes" element={<AdminMensajesPage />} /> 
            <Route path="/admin/plan-estudios" element={<AdminGestionPage />} /> 
            <Route path="/admin/reportes" element={<AdminReportesPage />} /> 
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
            <Route path="/alumno/historial-academico" element={<AlumnoHistorialAcademicoPage />} />
            <Route path="/alumno/perfil" element={<AlumnoPerfilPage />} />
            <Route path="/alumno/documentos-pagos" element={<AlumnoDocumentosPage />} />
          </Route>
        </Route>

        {/* MANEJO DE 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">La página que buscas no existe.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};