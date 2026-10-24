import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import { createProxyMiddleware } from "http-proxy-middleware";
import { gatewayAuth } from "./middlewares/gatewayAuth";
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.API_GATEWAY_PORT || 3000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";

const app = express();

// secure node js/ express applications by adding http response headers
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
  }),
);

app.use(httpLogger);

app.use("/health", (_req, res) => {
  successResponse(res, { service: "Api gateway" });
});

//create proxy starts
//auth-proxy :3000/auth/login or register api gateway forward this req to :3001/auth

app.use(
  gatewayAuth,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathFilter: "/auth",
  }),
);

app.use((_req, _res, next) => {
  throw new AppError(404, "No route found");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Api gateway is listening at port ${PORT}`);
});
