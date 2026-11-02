import multer from "multer";
import { AppError } from "shared";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const uploadMediaImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError(400, "only images are allowed"));
      return;
    }
    callback(null, true);
  },
});

export const uploadSingleMediaImage = uploadMediaImage.single("image");
