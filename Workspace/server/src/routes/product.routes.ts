import { Router } from "express";
import {
  createProductHandler,
  getProductsHandler,
  updateProductHandler,
  deleteProductHandler,
  aiSearchHandler,
} from "../controllers/product.controller";
import { validateRequest } from "../middleware/validateRequest";
import { productSchema, updateProductSchema } from "../schema/product.schema";

const router = Router();

router.get("/list", getProductsHandler);
router.post("/ai-search", aiSearchHandler);
router.post("/create", validateRequest(productSchema), createProductHandler);
router.put(
  "/:productId/edit",
  validateRequest(updateProductSchema),
  updateProductHandler,
);
router.delete("/:productId/delete", deleteProductHandler);

export default router;
