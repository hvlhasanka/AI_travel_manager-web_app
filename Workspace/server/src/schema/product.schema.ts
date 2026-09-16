import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  destination: z.string().min(1, "Destination is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  inventoryCount: z.number().int().nonnegative().default(0),
  validFrom: z.string().datetime("validFrom must be a valid ISO datetime"),
  validUntil: z.string().datetime("validUntil must be a valid ISO datetime"),
  status: z.string().default("ACTIVE"),
});

export const updateProductSchema = productSchema.partial();

export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
