import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { V4LoginScreen } from '../../src/components/v4/screens/V4LoginScreen';

export default function LoginRoute() {
  const params = useLocalSearchParams<{ mode?: 'signin' | 'signup'; role?: 'renter' | 'owner' }>();
  return (
    <V4LoginScreen
      initialMode={params.mode === 'signup' ? 'signup' : 'signin'}
      initialRole={params.role}
    />
  );
}

