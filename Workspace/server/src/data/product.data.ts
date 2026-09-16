import prisma from "../config/db";
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

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  searchValue?: string,
) => {
  const skip = (page - 1) * limit;

  const where = searchValue
    ? {
        productName: {
          contains: searchValue,
          mode: "insensitive" as const,
        },
      }
    : {};

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
