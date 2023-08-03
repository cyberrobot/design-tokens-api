import { z } from "zod";
import { transformsEnum, formatsEnum, transformGroupsEnum } from "~/constants";

export const PlatformSchema = z.object({
  name: z.string(),
  transformGroup: z.string(transformGroupsEnum).optional(),
  transforms: z.array(z.string(transformsEnum)).optional(),
  formats: z.array(z.string(formatsEnum)),
});

export const TokenSchema = z.object({
  namespace: z.string().optional(),
  platforms: z.array(PlatformSchema),
});

export const TokensSchema = z.array(TokenSchema);

export const TokenPlatformFormatSchema = z.object({
  name: z.string(),
  value: z.string(),
  url: z.string(),
});

export const PlatformOutputWithErrorSchema = z.object({
  name: z.string(),
  formats: z.array(TokenPlatformFormatSchema),
  error: z.string().optional(),
});

export const PlatformOutputSchema = z.object({
  name: z.string(),
  formats: z.array(TokenPlatformFormatSchema),
});

export const TokenOutputWithErrorSchema = z.object({
  namespace: z.string().optional(),
  platforms: z.array(PlatformOutputWithErrorSchema),
  error: z.string().optional(),
});

export const TokenOutputSchema = z.object({
  namespace: z.string().optional(),
  platforms: z.array(PlatformOutputSchema),
});

export const TransformTokenResponseSchema = z.object({
  id: z.string(),
  tokens: z.array(TokenOutputWithErrorSchema),
});

export const SaveTokenInputSchema = z.object({
  id: z.string(),
  token: TokenOutputSchema,
});
