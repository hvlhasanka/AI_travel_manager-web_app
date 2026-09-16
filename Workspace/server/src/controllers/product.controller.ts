import { Request, Response } from "express";
import * as productData from "../data/product.data";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productData.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
