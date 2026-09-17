import cors from "cors";

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

export const corsMiddleware = cors({
  origin: clientOrigin,
});
