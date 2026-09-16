import { Request, Response } from "express";
import { zodResponseFormat } from "openai/helpers/zod";
import * as productData from "../data/product.data";
import { aiSearchFiltersSchema } from "../schema/product.schema";
import openai from "../config/openai";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await productData.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchValue = req.query.searchValue as string | undefined;

    const destination = req.query.destination as string | undefined;
    const category = req.query.category as string | undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;
    const status = req.query.status as string | undefined;

    const { products, totalCount } = await productData.getProducts(
      page,
      limit,
      searchValue,
      {
        destination,
        category,
        minPrice,
        maxPrice,
        status,
      },
    );

    res.status(200).json({
      data: products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productData.updateProduct(productId, req.body);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    await productData.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const aiSearchHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a specialised individual with over a decade of experience in identifying key filters off of natural language. Please extract the filter parameters for the travel products based on the user's search query.
              Example 1:
              User - "Show me dinner buffets in Colombo"
              Output - {"category": "Dinner Buffet", "destination": "Colombo"}

              Example 2:
              User - "Show active family packages"
              Output - {"category": "Family Package", "status": "Active"}

              Example 3:
              User - "Show products below LKR 10,000"
              Output - {"maxPrice": 10000}

              Example 4:
              User - "Show airport transfer services"
              Output - {"category": "Airport Transfer"}`,
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(
        aiSearchFiltersSchema,
        "product_filters",
      ),
    });

    const extractedFilters = aiResponse.choices[0].message.parsed;

    if (!extractedFilters) {
      return res.status(500).json({ error: "Failed to parse filters from AI" });
    }

    const { products, totalCount } = await productData.getProducts(
      1,
      20,
      undefined,
      extractedFilters,
    );

    res.status(200).json({
      data: products,
      appliedFilters: extractedFilters,
      pagination: {
        total: totalCount,
        page: 1,
        limit: 20,
        totalPages: Math.ceil(totalCount / 20),
      },
    });
  } catch (error) {
    console.error("Error in AI search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
