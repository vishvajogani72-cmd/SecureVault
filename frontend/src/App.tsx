import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NavProvider, useNav } from '@/context/NavContext';
import { VaultProvider } from '@/context/VaultContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PasswordManagerPage } from '@/pages/PasswordManagerPage';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { SettingsPage } from '@/pages/SettingsPage';

type AuthView = 'login' | 'register';

function AuthFlow() {
  const [view, setView] = useState<AuthView>('login');
  return view === 'login' ? (
    <LoginPage onGoRegister={() => setView('register')} />
  ) : (
    <RegisterPage onGoLogin={() => setView('login')} />
  );
}

function RoutedApp() {
  const { route } = useNav();
  switch (route) {
    case 'dashboard':
      return <DashboardPage />;
    case 'passwords':
      return <PasswordManagerPage />;
    case 'generator':
      return <GeneratorPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

function Gate() {
  const { token } = useAuth();

  // Locked: user identity retained but session token dropped -> back to auth flow.
  if (!token) return <AuthFlow />;

  return (
    <VaultProvider>
      <AppShell>
        <RoutedApp />
      </AppShell>
    </VaultProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NavProvider>
          <Gate />
        </NavProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
