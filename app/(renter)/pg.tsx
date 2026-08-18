import React from 'react';
import { RenterHomeScreen } from '../../src/components/home/RenterHomeScreen';
import { useAppStore } from '../../src/store/useAppStore';

export default function PGCategoryPage() {
  const { user } = useAppStore();
  return <RenterHomeScreen user={user} initialCategory="pg" />;
}
