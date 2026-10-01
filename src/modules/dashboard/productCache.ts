import {getAllKeys, getString, removeKey, setString} from '../../utils/MMKVStorage';
import type {Product} from './productTypes';

const CACHE_KEY_PREFIX = 'product-list:';

export type ProductListCache = {
  products: Product[];
  nextSkip: number;
  total: number;
  hasNextPage: boolean;
};

const getCacheKey = (query: string) =>
  `${CACHE_KEY_PREFIX}${encodeURIComponent(query.trim().toLowerCase() || 'all')}`;

export const getProductListCache = (query: string): ProductListCache | null => {
  const serializedCache = getString(getCacheKey(query));

  if (!serializedCache) {
    return null;
  }

  try {
    return JSON.parse(serializedCache) as ProductListCache;
  } catch {
    removeKey(getCacheKey(query));
    return null;
  }
};

export const setProductListCache = (
  query: string,
  cache: ProductListCache,
): void => {
  setString(getCacheKey(query), JSON.stringify(cache));
};

export const clearProductListCache = (): void => {
  getAllKeys()
    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    .forEach(removeKey);
};