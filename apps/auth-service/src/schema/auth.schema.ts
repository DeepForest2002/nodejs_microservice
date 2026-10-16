import { email, z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password len should be atleast 8"),
});

export const loginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password is required"),
});

export type registerInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
