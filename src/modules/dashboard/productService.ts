import {API_BASE_URLS, API_ENDPOINTS} from '../../constants/api';
import {apiClient} from '../../utils/ApiClient';
import type {ProductPageResponse} from './productTypes';

export const getProductsPage = async (
  skip: number,
  limit = 10,
  searchQuery = '',
  signal?: AbortSignal,
): Promise<ProductPageResponse> => {
  const normalizedQuery = searchQuery.trim();
  const endpoint = normalizedQuery
    ? `${API_ENDPOINTS.DUMMY_JSON.SEARCH_PRODUCTS}?q=${encodeURIComponent(normalizedQuery)}&limit=${limit}&skip=${skip}`
    : `${API_ENDPOINTS.DUMMY_JSON.PRODUCTS}?limit=${limit}&skip=${skip}`;

  return apiClient.get<ProductPageResponse>(
    endpoint,
    {baseUrl: API_BASE_URLS.DUMMY_JSON, signal},
  );
};