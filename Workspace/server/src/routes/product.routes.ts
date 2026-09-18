import { Router } from "express";
import {
  createProductHandler,
  getProductsHandler,
  updateProductHandler,
  deleteProductHandler,
  aiSearchHandler,
  aiGenerateProductHandler,
  aiGenerateImageHandler,
  getProductStatsHandler,
} from "../controllers/product.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  productSchema,
  updateProductSchema,
  deleteProductSchema,
} from "../schema/product.schema";

const router = Router();

router.get("/list", getProductsHandler);
router.get("/stats", getProductStatsHandler);
router.post("/ai-search", aiSearchHandler);
router.post("/ai-generate", aiGenerateProductHandler);
router.post("/ai-generate-image", aiGenerateImageHandler);
router.post("/create", validateRequest(productSchema), createProductHandler);
router.put(
  "/:productId/edit",
  validateRequest(updateProductSchema),
  updateProductHandler,
);
router.delete(
  "/delete",
  validateRequest(deleteProductSchema),
  deleteProductHandler,
);

export default router;
