import {API_BASE_URL, API_ENDPOINTS} from '../../constants/api';
import {apiClient} from '../../utils/ApiClient';
import type {ProductPageResponse} from './productTypes';

const PRODUCT_FIELDS = 'category,price,thumbnail,images,title,id';
const PRODUCT_PAGE_SIZE = 10;

type RandomProductsResponse = {
  data: {
    data: ProductPageResponse['products'];
    page: number;
    limit: number;
    totalItems: number;
  };
  message: string;
  success: boolean;
};

export const getProductsPage = async (
  page = 1,
  searchQuery = '',
  signal?: AbortSignal,
): Promise<ProductPageResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PRODUCT_PAGE_SIZE),
    inc: PRODUCT_FIELDS,
  }).toString();
  const response = await apiClient.get<RandomProductsResponse>(
    `${API_ENDPOINTS.ECOMMERCE.RANDOM_PRODUCTS}?${query}`,
    {baseUrl: API_BASE_URL, signal},
  );

  if (!response.success) {
    throw new Error(response.message || 'Could not load products.');
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const products = normalizedQuery
    ? response.data.data.filter(product =>
        `${product.title} ${product.category ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : response.data.data;

  return {
    products,
    total: response.data.totalItems,
    page: response.data.page,
    limit: response.data.limit,
  };
};