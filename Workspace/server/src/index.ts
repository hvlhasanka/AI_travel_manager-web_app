import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/corsConfig";
import { globalLimiter } from "./middleware/rateLimiter";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(globalLimiter);
app.use(corsMiddleware);
app.use(express.json());

// Health check route
app.get("/health-check", (req, res) => {
  res.send("Travel Manager - Server Live");
});

// API Routes
app.use("/travel-manager/v1/product", productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
