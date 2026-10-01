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
  const path = normalizedQuery
    ? API_ENDPOINTS.DUMMY_JSON.SEARCH_PRODUCTS
    : API_ENDPOINTS.DUMMY_JSON.PRODUCTS;
  const query = normalizedQuery
    ? `q=${encodeURIComponent(normalizedQuery)}&`
    : '';
  const endpoint =
    `${path}?${query}limit=${limit}&skip=${skip}`;

  return apiClient.get<ProductPageResponse>(
    endpoint,
    {baseUrl: API_BASE_URLS.DUMMY_JSON, signal},
  );
};