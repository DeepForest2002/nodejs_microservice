import { userInfo } from "node:os";
import * as taskRepo from "../repositories/task.repository";
import { titleType } from "../schema/task.schema";

export async function createTaskService(input: titleType, userId: string) {
  const task = await taskRepo.createTaskRepo({
    title: input.title,
    user_id: userId,
  });
  return task;
}

export async function getTasksService(
  userId: string,
  role: string,
  limit: number,
) {
  const tasks = await taskRepo.getAllTasks({
    user_id: userId,
    role: role,
    limit: limit,
  });
  return tasks;
}
