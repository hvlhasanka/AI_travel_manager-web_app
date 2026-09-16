import prisma from "../config/db";
import { CreateProductInput } from "../schema/product.schema";

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
