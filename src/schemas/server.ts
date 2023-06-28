import { z } from "zod";
import { transforms, formats, transformGroup } from "~/constants";

export const PlatformSchema = z.object({
  name: z.string(),
  transformGroup: z.enum(transformGroup).optional(),
  transforms: z.array(z.enum(transforms)).optional(),
  formats: z.array(z.enum(formats)).optional(),
});

export const TokenSchema = z.object({
  namespace: z.string(),
  platforms: z.array(PlatformSchema),
});

export const TokensSchema = z.array(TokenSchema);
