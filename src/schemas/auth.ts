import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Must be a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64),
});

export const signUpSchema = loginSchema.extend({
  username: z.string().nonempty("Username is required"),
});

export const passwordResetSchema = z.object({
  password: loginSchema.shape.password,
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64),
});

export const userDetailsSchema = z.object({
  username: signUpSchema.shape.username,
  email: signUpSchema.shape.email,
});
