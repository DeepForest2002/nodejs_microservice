import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import { MediaRouter } from "./routes/media.routes";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const app = express();
const PORT = process.env.MEDIA_SERVICE_PORT || 3003;

app.use(express.json());
app.use(httpLogger);
app.get("/health", (_req, res) => {
  successResponse(res, { msg: "Media-service" });
});

console.log("Req comes here");
app.use("/media", requireGatewaySecret, MediaRouter);

app.use((_req, res, next) => {
  next(new AppError(404, "Route not found at media layer"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Media service is listening at port number ${PORT}`);
});
