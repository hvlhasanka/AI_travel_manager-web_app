import type {
  Product,
  ProductStats,
  GetProductsResponse,
} from "../types/product.types";
import type { FilterFormValues } from "../components/product/ProductFilter";
import { MAX_PRICE } from "../constants";

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
      filters.maxPrice < MAX_PRICE
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

export const aiSearchProducts = async (
  prompt: string,
): Promise<{
  data: Product[];
  appliedFilters: FilterFormValues;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/ai-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to perform AI search");
  }
  return response.json();
};

export const aiGenerateProduct = async (
  prompt: string,
): Promise<{
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: number;
  inventoryCount: number;
  validFrom: string;
  validUntil: string;
  status: string;
}> => {
  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/ai-generate-product`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to generate product via AI");
  }
  return response.json();
};

export const aiGenerateImage = async (data: {
  productName: string;
  description: string;
  destination: string;
  category: string;
}): Promise<{ imageUrl: string }> => {
  const response = await fetch(
    `${API_URL}/travel-manager/v1/product/ai-generate-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to generate image via AI");
  }
  return response.json();
};

export const exportProducts = async (
  selectedIds: string[],
  filters?: FilterFormValues | null,
): Promise<void> => {
  const payload =
    selectedIds.length > 0
      ? { productIds: selectedIds }
      : {
          searchValue: filters?.product,
          destination: filters?.destination,
          category: filters?.category,
          minPrice: filters?.minPrice,
          maxPrice: filters?.maxPrice,
          status: filters?.status,
        };

  const response = await fetch(`${API_URL}/travel-manager/v1/product/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to export products");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "products_export.xlsx");
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
