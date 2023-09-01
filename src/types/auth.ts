import { type z } from "zod";
import { type loginSchema, type signUpSchema } from "~/schemas/auth";

export type TLogin = z.infer<typeof loginSchema>;
export type TSignUp = z.infer<typeof signUpSchema>;
