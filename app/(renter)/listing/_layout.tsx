import { Stack } from 'expo-router';

export default function RenterListingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF8F5' },
      }}
    />
  );
}
