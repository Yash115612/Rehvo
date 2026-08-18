import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RenterHomeScreen } from '../../src/components/home/RenterHomeScreen';
import { useAppStore } from '../../src/store/useAppStore';
import { PropertyCategory } from '../../src/components/home/PropertyCategorySwitcher';

export default function HomeRoute() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: PropertyCategory }>();
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <RenterHomeScreen
      user={user}
      initialCategory={category || 'rent'}
      onLogout={handleLogout}
    />
  );
}
