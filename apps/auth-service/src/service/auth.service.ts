import { loginInput, registerInput } from "../schema/auth.schema";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import { AppError, SignInToken } from "shared";
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

export async function loginUserService(
  input: loginInput,
): Promise<string | null> {
  const user = await findByEmail(input.email);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }
  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  // create the jwt token
  const token = SignInToken({ userId: user.id, role: user.role });
  return token;
}

export async function getMeService(userId: string) {
  const user = await findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}
