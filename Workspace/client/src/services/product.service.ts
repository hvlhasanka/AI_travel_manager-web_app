import type { ProductStats } from "../types/product.types";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchStats = async (): Promise<ProductStats> => {
  const response = await fetch(`${apiBaseUrl}/travel-manager/v1/product/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
};
