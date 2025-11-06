// src/App.tsx - MODIFICADO

import React from 'react';
import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext'; // <-- NUEVO

const App: React.FC = () => {
  return (
    // TenantProvider DEBE estar primero para que AuthProvider lo use
    <TenantProvider> 
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </TenantProvider>
  );
};

export default App;