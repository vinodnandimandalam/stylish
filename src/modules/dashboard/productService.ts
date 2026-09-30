import {API_BASE_URLS, API_ENDPOINTS} from '../../constants/api';
import {apiClient} from '../../utils/ApiClient';
import type {ProductPageResponse} from './productTypes';

export const getProductsPage = async (
  skip: number,
  limit = 10,
): Promise<ProductPageResponse> => {
  return apiClient.get<ProductPageResponse>(
    `${API_ENDPOINTS.DUMMY_JSON.PRODUCTS}?limit=${limit}&skip=${skip}`,
    {baseUrl: API_BASE_URLS.DUMMY_JSON},
  );
};