import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Standard Native Asynchronous Storage (AsyncStorage)
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (_e) {
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (_e) {
    // silent catch in production
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (_e) {
    // silent catch in production
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (_e) {
    // silent catch in production
  }
};

/**
 * Encrypted Native Storage for Sensitive Credentials / Auth Tokens
 */
export const getSecureItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return getItem(key);
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch (_e) {
    return getItem(key);
  }
};

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return setItem(key, value);
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (_e) {
    await setItem(key, value);
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return removeItem(key);
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (_e) {
    await removeItem(key);
  }
};
