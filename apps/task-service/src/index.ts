import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import {
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
  AppError,
} from "shared";
import { TaskRouter } from "./routes/task.route";
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const app = express();
const PORT = process.env.TASK_SERVICE_PORT || 3002;

app.use(httpLogger);
app.use(express.json());
app.get("/health", (req, res) => {
  successResponse(res, { service: "Task service" });
});

app.use("/tasks", requireGatewaySecret, TaskRouter);

app.use((_req, res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Task service is running at port ${PORT}`);
});
