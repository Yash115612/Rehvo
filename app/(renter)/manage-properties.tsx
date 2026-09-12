import React from 'react';
import { Redirect } from 'expo-router';

export default function ManagePropertiesRoute() {
  return <Redirect href="/(owner)/listings" />;
}
