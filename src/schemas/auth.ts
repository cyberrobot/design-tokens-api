import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
});
