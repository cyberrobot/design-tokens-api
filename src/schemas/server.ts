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
