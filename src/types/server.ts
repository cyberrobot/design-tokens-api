import { type transformGroup } from "style-dictionary";
import { type z } from "zod";
import { type formats, type transforms } from "~/constants";
import {
  type PlatformSchema,
  type TokensSchema,
  type TokenSchema,
  type TokenOutputWithErrorSchema,
  type PlatformOutputWithErrorSchema,
  type TokenPlatformFormatSchema,
  type TransformTokenResponseSchema,
  type SaveTokenInputSchema,
  type ImportTokenSchema,
} from "~/schemas/server";

// export type TokenTransform = {
//   id: string;
//   tokens: TokenOutput[];
// };
export type SaveTokenResponse = {
  transformId?: string;
  success: boolean;
};

export type TransformTokenResponse = z.infer<
  typeof TransformTokenResponseSchema
>;

export type TSaveTokenInput = z.infer<typeof SaveTokenInputSchema>;

export type TokenPlatformFormat = z.infer<typeof TokenPlatformFormatSchema>;

export type PlatformOutput = z.infer<typeof PlatformOutputWithErrorSchema>;

export type TokenOutput = z.infer<typeof TokenOutputWithErrorSchema>;

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type TransformGroup = ArrayElement<typeof transformGroup>;

export type Format = ArrayElement<typeof formats>;

export type Platform = z.infer<typeof PlatformSchema>;

export type Platforms = Platform[];

export type Tokens = z.infer<typeof TokensSchema>;

export type Token = z.infer<typeof TokenSchema>;

export type Transform = ArrayElement<typeof transforms>;

export type TImportTransform = {
  id: string;
  createdAt: Date;
  platforms: TImportPlatform[];
  importsId?: string | null;
};

export type TImportPlatform = {
  id: string;
  name: string;
  transformsId: string;
  formats: TImportFormat[];
};

export type TImportFormat = {
  id: string;
  name: string;
  ext: string;
  value: string;
  url?: string | null;
  platformsId: string;
};

export type TTransformRemoveResponse = {
  success: boolean;
};

export type TImportToken = z.infer<typeof ImportTokenSchema>;
