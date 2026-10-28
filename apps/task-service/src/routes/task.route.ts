import express from "express";
import { ValidateBody } from "shared";
import { titleSchema } from "../schema/task.schema";
import * as taskController from "../controller/task.controller";

export const TaskRouter = express();

TaskRouter.post(
  "",
  ValidateBody(titleSchema),
  taskController.createTaskController,
);
