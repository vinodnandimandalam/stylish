import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, serializedValue);
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
