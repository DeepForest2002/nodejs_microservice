import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import { AuthRouter } from "./routes/auth.route";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.AUTH_PORT || 3001;
const app = express();

app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "auth-service" });
});

app.use("/auth", requireGatewaySecret, AuthRouter);

app.use((_req, res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("App is listening at port ", PORT);
});
