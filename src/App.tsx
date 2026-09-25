import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { LoginPage } from './components/auth/LoginPage';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { AppShell } from './components/layout/AppShell';

const MainApp: React.FC = () => {
  const { isAuthenticated, isOnboarded, completeOnboarding } = useERP();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!isOnboarded) {
    return <OnboardingWizard onComplete={() => completeOnboarding({})} />;
  }

  return <AppShell />;
};

export default function App() {
  return (
    <ERPProvider>
      <MainApp />
    </ERPProvider>
  );
}
