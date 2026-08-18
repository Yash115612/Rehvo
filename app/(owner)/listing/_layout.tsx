import React from 'react';
import { Stack } from 'expo-router';

export default function ListingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="property-type" />
      <Stack.Screen name="location" />
      <Stack.Screen name="details" />
      <Stack.Screen name="amenities" />
      <Stack.Screen name="photos" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="publish" />
    </Stack>
  );
}
