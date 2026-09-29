export const SCREENS = {
  PUBLIC: {
    ONBOARDING: 'Onboarding',
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  PRIVATE: {
    DASHBOARD: 'Dashboard',
  },
} as const;

export type PublicRouteName =
  | typeof SCREENS.PUBLIC.ONBOARDING
  | typeof SCREENS.PUBLIC.LOGIN
  | typeof SCREENS.PUBLIC.REGISTER
  | typeof SCREENS.PUBLIC.FORGOT_PASSWORD;

export type PrivateRouteName = typeof SCREENS.PRIVATE.DASHBOARD;
