import { type z } from "zod";
import {
  type passwordResetSchema,
  type loginSchema,
  type signUpSchema,
  type userDetailsSchema,
} from "~/schemas/auth";

export type TLogin = z.infer<typeof loginSchema>;
export type TSignUp = z.infer<typeof signUpSchema>;
export type TUserDetails = z.infer<typeof userDetailsSchema>;
export type TPasswordReset = z.infer<typeof passwordResetSchema>;
