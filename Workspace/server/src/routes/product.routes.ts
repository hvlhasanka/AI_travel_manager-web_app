import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validateRequest";
import { productSchema } from "../schema/product.schema";

const router = Router();

router.post("/create", validateRequest(productSchema), createProduct);

export default router;
