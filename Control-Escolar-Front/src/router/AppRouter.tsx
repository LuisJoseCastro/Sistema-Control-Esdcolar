// src/router/AppRouter.tsx - CÓDIGO FINAL CON LAYOUT SAAS

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types/models';

// Importar los componentes principales de Layout y Vistas
import { LandingPage } from '../pages/public/LandingPage';
import { OnboardingPage } from '../pages/public/OnboardingPage';
import { LoginPageGeneral } from '../pages/public/LoginPageGeneral'; 

// Importar el Layout Principal que maneja las Sidebars (CREADO EN EL PASO ANTERIOR)
import { AppLayout } from '../components/layout/AppLayout'; 

// Importar los Dashboards reales (Asumiendo que existen)
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { DocenteDashboardPage } from '../pages/docente/DocenteDashboardPage';
import { AlumnoDashboardPage } from '../pages/alumno/AlumnoDashboardPage';


// PrivateRoute: protege rutas por rol
const PrivateRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();

  // Si no está logueado, enviar al Login General
  if (!isLoggedIn) return <Navigate to="/login" replace />; 

  // Si está logueado pero el rol no tiene permiso para la ruta
  if (!allowedRoles.includes((role ?? 'ALUMNO') as Role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl text-red-600">403 | Acceso Denegado</h1>
      </div>
    );
  }

  return <Outlet />; // Permite que se cargue el contenido dentro del AppLayout
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ========================================================= */}
        {/* === RUTAS PÚBLICAS DE ONBOARDING (SaaS) Y LOGIN ÚNICO === */}
        {/* ========================================================= */}
        
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/onboarding" element={<OnboardingPage />} /> 
        <Route path="/login" element={<LoginPageGeneral />} />
        
        {/* Redirecciones de conveniencia (Limpia URLs antiguas) */}
        <Route path="/acceso" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/docente/login" element={<Navigate to="/login" replace />} />
        <Route path="/alumno/login" element={<Navigate to="/login" replace />} />

        {/* ========================================================= */}
        {/* === RUTAS PROTEGIDAS CON LAYOUT DINÁMICO === */}
        {/* Todas las rutas protegidas se anidan dentro del AppLayout */}
        <Route element={<AppLayout />}>
        
            {/* RUTAS ADMINISTRADOR (Protegidas por PrivateRoute) */}
            <Route element={<PrivateRoute allowedRoles={[ 'ADMIN' ]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              {/* Aquí irán las vistas de gestión de usuarios, reportes, etc. */}
            </Route>

            {/* RUTAS DOCENTE (Protegidas por PrivateRoute) */}
            <Route element={<PrivateRoute allowedRoles={[ 'DOCENTE' ]} />}>
              <Route path="/docente/dashboard" element={<DocenteDashboardPage />} />
              {/* Aquí irán las vistas de calificaciones, asistencia, etc. */}
            </Route>

            {/* RUTAS ALUMNO (Protegidas por PrivateRoute) */}
            <Route element={<PrivateRoute allowedRoles={[ 'ALUMNO' ]} />}>
              <Route path="/alumno/dashboard" element={<AlumnoDashboardPage />} />
              {/* Aquí irán las vistas de notas, horario, etc. */}
            </Route>

        </Route>
        {/* ========================================================= */}

        {/* 404 - Página no encontrada */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};