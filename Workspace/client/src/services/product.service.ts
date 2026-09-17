import type { ProductStats, GetProductsResponse } from "../types/product.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchStats = async (): Promise<ProductStats> => {
  const response = await fetch(`${API_URL}/travel-manager/v1/product/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch product statistics");
  }
  return response.json();
};

export const fetchProducts = async (
  page = 1,
  limit = 10,
): Promise<GetProductsResponse> => {
  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/list?page=${page}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};
