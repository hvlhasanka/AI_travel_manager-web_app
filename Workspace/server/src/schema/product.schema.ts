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

export const deleteProductSchema = z.object({
  productIds: z
    .array(z.string())
    .min(1, "At least one product ID must be provided"),
});

export const aiSearchFiltersSchema = z.object({
  destination: z
    .string()
    .nullable()
    .describe("The destination city or location mentioned in the query."),
  category: z
    .string()
    .nullable()
    .describe(
      "The type or category of product/package (e.g. 'Dinner Buffet', 'Family Package').",
    ),
  minPrice: z
    .number()
    .nullable()
    .describe("The minimum price mentioned, if any."),
  maxPrice: z
    .number()
    .nullable()
    .describe("The maximum price or budget mentioned, if any."),
  status: z
    .string()
    .nullable()
    .describe("The status mentioned (e.g. 'Active')."),
});

export const aiGenerateProductSchema = z.object({
  productName: z.string().describe("The name of the product or package."),
  destination: z.string().describe("The destination city or location."),
  category: z.string().describe("The type or category of the product."),
  description: z.string().describe("A detailed description of the product."),
  price: z.number().describe("The price of the product."),
  inventoryCount: z.number().describe("The inventory count of the product."),
  validFrom: z
    .string()
    .describe(
      "The start date in ISO format, if mentioned, otherwise empty string.",
    ),
  validUntil: z
    .string()
    .describe(
      "The end date in ISO format, if mentioned, otherwise empty string.",
    ),
  status: z.string().describe("The status, e.g., 'ACTIVE' or 'INACTIVE'."),
});
