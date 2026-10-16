import { registerInput } from "../schema/auth.schema";
import { createUser, findByEmail } from "../repositories/user.repo";
import { AppError } from "shared";
import bcrypt from "bcryptjs";

export async function createUserService(input: registerInput) {
  const existing = await findByEmail(input.email);
  if (existing) {
    throw new AppError(409, "User already exists");
  }
  const password_hash = await bcrypt.hash(input.password, 10);
  const user = await createUser({
    name: input.name,
    email: input.email,
    password_hash,
    role: "user",
  });
  return user;
}
