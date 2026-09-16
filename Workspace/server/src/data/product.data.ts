import prisma from "../config/db";
import { Prisma } from "@prisma/client";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/product.schema";

export const createProduct = async (data: CreateProductInput) => {
  return await prisma.product.create({
    data: {
      productName: data.productName,
      destination: data.destination,
      category: data.category,
      description: data.description,
      price: data.price,
      inventoryCount: data.inventoryCount,
      validFrom: new Date(data.validFrom),
      validUntil: new Date(data.validUntil),
      status: data.status,
    },
  });
};

export interface ProductFilters {
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  searchValue?: string,
  filters?: ProductFilters,
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    validUntil: {
      gte: new Date(),
    },
  };

  if (searchValue) {
    where.productName = {
      contains: searchValue,
      mode: "insensitive",
    };
  }

  if (filters?.destination) {
    where.destination = {
      contains: filters.destination,
      mode: "insensitive",
    };
  }

  if (filters?.category) {
    where.category = {
      contains: filters.category,
      mode: "insensitive",
    };
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductInput,
) => {
  return await prisma.product.update({
    where: { productId },
    data: {
      ...data,
      validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    },
  });
};

export const deleteProduct = async (productId: string) => {
  return await prisma.product.delete({
    where: { productId },
  });
};
