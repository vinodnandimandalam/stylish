export const SCREENS = {
  PUBLIC: {
    ONBOARDING: 'Onboarding',
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  PRIVATE: {
    HOME: 'Home',
    WISHLIST: 'Wishlist',
    CART: 'Cart',
    SEARCH: 'Search',
    SETTINGS: 'Settings',
  },
} as const;

export type PublicRouteName =
  | typeof SCREENS.PUBLIC.ONBOARDING
  | typeof SCREENS.PUBLIC.LOGIN
  | typeof SCREENS.PUBLIC.REGISTER
  | typeof SCREENS.PUBLIC.FORGOT_PASSWORD;

export type PrivateTabName =
  (typeof SCREENS.PRIVATE)[keyof typeof SCREENS.PRIVATE];

export type PrivateTabParamList = {
  [SCREENS.PRIVATE.HOME]: undefined;
  [SCREENS.PRIVATE.WISHLIST]: undefined;
  [SCREENS.PRIVATE.CART]: undefined;
  [SCREENS.PRIVATE.SEARCH]: undefined;
  [SCREENS.PRIVATE.SETTINGS]: undefined;
};
