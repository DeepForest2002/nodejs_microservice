import { Router } from "express";
import * as attachmentController from "../controller/media.controller";
import { uploadSingleMediaImage } from "../middlewares/media.middleware";
export const MediaRouter = Router();

// http://localhost:3000/tasks/2/attachments = until task base url remaining is path
console.log("Inside media routes");
MediaRouter.post(
  "/:taskId/attachments",
  uploadSingleMediaImage,
  attachmentController.uploadAttachmentController,
);

MediaRouter.get("", attachmentController.getAllAttachmentsController);
