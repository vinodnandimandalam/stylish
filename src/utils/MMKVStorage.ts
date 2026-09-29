import {createMMKV} from 'react-native-mmkv';

export const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
  IS_LOGGED_IN: 'isLoggedIn',
} as const;

const storage = createMMKV();

export const getBoolean = (key: string): boolean | undefined =>
  storage.getBoolean(key);

export const setBoolean = (key: string, value: boolean): void => {
  storage.set(key, value);
};