import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Standard Native Asynchronous Storage (AsyncStorage)
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn(`[Storage] Error reading ${key}:`, e);
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[Storage] Error saving ${key}:`, e);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`[Storage] Error removing ${key}:`, e);
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.warn(`[Storage] Error clearing storage:`, e);
  }
};

/**
 * Encrypted Native Storage for Sensitive Credentials / Auth Tokens
 */
export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.warn(`[SecureStore] Error reading ${key}:`, e);
    return getItem(key);
  }
};

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.warn(`[SecureStore] Error saving ${key}:`, e);
    await setItem(key, value);
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.warn(`[SecureStore] Error removing ${key}:`, e);
    await removeItem(key);
  }
};
