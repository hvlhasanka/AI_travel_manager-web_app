import type {
  Product,
  ProductStats,
  GetProductsResponse,
} from "../types/product.types";

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
  const result = await response.json();

  return {
    products: result.data || [],
    totalCount: result.pagination?.total || 0,
  };
};

export const createProduct = async (
  data: Omit<Product, "productId" | "createdAt" | "updatedAt">,
): Promise<Product> => {
  const response = await fetch(`${API_URL}/travel-manager/v1/product/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg =
      errorData?.details?.[0]?.message ||
      errorData?.error ||
      "Failed to create product";
    throw new Error(errorMsg);
  }
  return response.json();
};

export const updateProduct = async (
  productId: string,
  data: Partial<Omit<Product, "productId" | "createdAt" | "updatedAt">>,
): Promise<Product> => {
  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/${productId}/edit`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg =
      errorData?.details?.[0]?.message ||
      errorData?.error ||
      "Failed to update product";
    throw new Error(errorMsg);
  }
  return response.json();
};
