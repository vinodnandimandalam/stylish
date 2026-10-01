export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail?: string;
  images?: string[];
  brand?: string;
  category?: string;
};

export type ProductPageResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductSortOrder = 'asc' | 'desc';