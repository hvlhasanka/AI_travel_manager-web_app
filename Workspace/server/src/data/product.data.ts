import prisma from "../config/db";
import { Prisma } from "@prisma/client";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/product.schema";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

export const createProduct = async (data: CreateProductInput) => {
  const productId = nanoid();

  return await prisma.product.create({
    data: {
      productId,
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
  destination?: string | null;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  status?: string | null;
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

  if (filters?.minPrice != null || filters?.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
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

export const deleteProducts = async (productIds: string[]) => {
  return await prisma.product.deleteMany({
    where: { productId: { in: productIds } },
  });
};

export const getProductStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalCount, thisMonthCount, activeCount, expiredCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.product.count({
        where: {
          status: "ACTIVE",
        },
      }),
      prisma.product.count({
        where: {
          status: "EXPIRED",
        },
      }),
    ]);

  return {
    totalCount,
    thisMonthCount,
    activeCount,
    expiredCount,
  };
};
