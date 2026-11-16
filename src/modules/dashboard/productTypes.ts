export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  description?: string;
  brand?: string;
  stock?: number;
  discountPercentage?: number;
  rating?: number;
};

export type ProductPageResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ProductSortOrder = 'asc' | 'desc';