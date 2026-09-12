import React from 'react';
import { Stack } from 'expo-router';

export default function OwnerListingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    />
  );
}
