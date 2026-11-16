export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
};

export type ProductPageResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ProductSortOrder = 'asc' | 'desc';