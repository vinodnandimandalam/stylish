import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_SERVICE = 'com.stylish.auth';
const ACCESS_TOKEN_USERNAME = 'accessToken';

export const storeAccessToken = async (accessToken: string): Promise<void> => {
  const stored = await Keychain.setGenericPassword(
    ACCESS_TOKEN_USERNAME,
    accessToken,
    {service: ACCESS_TOKEN_SERVICE},
  );

  if (!stored) {
    throw new Error('Could not securely store the access token.');
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: ACCESS_TOKEN_SERVICE,
  });

  return credentials ? credentials.password : null;
};

export const clearAccessToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: ACCESS_TOKEN_SERVICE});
};