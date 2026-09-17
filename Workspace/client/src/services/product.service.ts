import type {
  Product,
  ProductStats,
  GetProductsResponse,
} from "../types/product.types";
import type { FilterFormValues } from "../components/product/ProductFilter";

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
  filters?: FilterFormValues | null,
): Promise<GetProductsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  if (filters) {
    if (filters.product) queryParams.append("searchValue", filters.product);
    if (filters.destination)
      queryParams.append("destination", filters.destination);
    if (filters.category) queryParams.append("category", filters.category);
    if (
      filters.minPrice !== undefined &&
      filters.minPrice !== null &&
      filters.minPrice > 0
    )
      queryParams.append("minPrice", filters.minPrice.toString());
    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== null &&
      filters.maxPrice < 100000
    )
      queryParams.append("maxPrice", filters.maxPrice.toString());
    if (filters.status && filters.status !== "ALL")
      queryParams.append("status", filters.status);
  }

  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/list?${queryParams.toString()}`,
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

export const deleteProduct = async (
  productId: string | string[],
): Promise<void> => {
  const payload = {
    productIds: Array.isArray(productId) ? productId : [productId],
  };

  const response = await fetch(`${API_URL}/travel-manager/v1/product/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg =
      errorData?.details?.[0]?.message ||
      errorData?.error ||
      "Failed to delete product(s)";
    throw new Error(errorMsg);
  }
};
