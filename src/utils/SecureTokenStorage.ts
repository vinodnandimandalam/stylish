import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_SERVICE = 'com.stylish.auth.refresh';
const REFRESH_TOKEN_USERNAME = 'refreshToken';
const LEGACY_ACCESS_TOKEN_SERVICE = 'com.stylish.auth';

export const storeRefreshToken = async (refreshToken: string): Promise<void> => {
  const stored = await Keychain.setGenericPassword(
    REFRESH_TOKEN_USERNAME,
    refreshToken,
    {service: REFRESH_TOKEN_SERVICE},
  );

  if (!stored) {
    throw new Error('Could not securely store the refresh token.');
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: REFRESH_TOKEN_SERVICE,
  });

  return credentials ? credentials.password : null;
};

export const clearRefreshToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: REFRESH_TOKEN_SERVICE});
};

export const clearLegacyAccessToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: LEGACY_ACCESS_TOKEN_SERVICE});
};