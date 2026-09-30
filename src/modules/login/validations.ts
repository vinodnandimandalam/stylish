import {strings} from '../../constants/strings';

export const validateIdentifier = (identifier: string): string | undefined => {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    return strings.loginIdentifierRequired;
  }

  if (normalizedIdentifier.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)
      ? undefined
      : strings.loginIdentifierInvalid;
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined =>
  password.trim() ? undefined : strings.loginPasswordRequired;