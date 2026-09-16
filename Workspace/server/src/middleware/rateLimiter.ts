import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 50, // Limit each IP to 50 requests per 1 minute
  standardHeaders: "draft-7", // draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
