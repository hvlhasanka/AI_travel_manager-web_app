export interface ProductStats {
  totalCount: number;
  thisMonthCount: number;
  activeCount: number;
  expiredCount: number;
}

export interface Product {
  productId: string;
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: number;
  inventoryCount: number;
  validFrom: string;
  validUntil: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  products: Product[];
  totalCount: number;
}
