import React from 'react';
import { OwnerDashboardScreen } from '../../src/components/owner/OwnerDashboardScreen';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';

export default function OwnerDashboardRoute() {
  const router = useRouter();
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return <OwnerDashboardScreen user={user} onLogout={handleLogout} />;
}
