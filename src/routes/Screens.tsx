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
    SETTINGS: 'Settings',
    TABS: 'MainTabs',
    PRODUCT_DETAILS: 'ProductDetails',
  },
} as const;

export type PublicRouteName =
  | typeof SCREENS.PUBLIC.ONBOARDING
  | typeof SCREENS.PUBLIC.LOGIN
  | typeof SCREENS.PUBLIC.REGISTER
  | typeof SCREENS.PUBLIC.FORGOT_PASSWORD;

export type PrivateTabName =
  | typeof SCREENS.PRIVATE.HOME
  | typeof SCREENS.PRIVATE.WISHLIST
  | typeof SCREENS.PRIVATE.CART
  | typeof SCREENS.PRIVATE.SETTINGS;

export type PrivateTabParamList = {
  [SCREENS.PRIVATE.HOME]: undefined;
  [SCREENS.PRIVATE.WISHLIST]: undefined;
  [SCREENS.PRIVATE.CART]: undefined;
  [SCREENS.PRIVATE.SETTINGS]: undefined;
};

export type PrivateStackParamList = {
  [SCREENS.PRIVATE.TABS]: undefined;
  [SCREENS.PRIVATE.PRODUCT_DETAILS]: {productId: number};
};
