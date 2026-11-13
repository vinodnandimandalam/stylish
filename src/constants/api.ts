export const API_BASE_URLS = {
  FREE_API: 'https://prod-main-api-704464-00tre1p1erm.compute.instacloud-edge.com/api/v1',
  DUMMY_JSON: 'https://dummyjson.com',
} as const;

export const API_BASE_URL = API_BASE_URLS.FREE_API;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REFRESH_TOKEN: '/users/refresh-token',
    LOGOUT: '/users/logout',
  },
  ECOMMERCE: {
    PRODUCTS: '/ecommerce/products',
  },
  DUMMY_JSON: {
    PRODUCTS: '/products',
    SEARCH_PRODUCTS: '/products/search',
  },
} as const;