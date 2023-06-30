import { type transformGroup } from "style-dictionary";
import { type z } from "zod";
import { type formats, type transforms } from "~/constants";
import {
  type PlatformSchema,
  type TokensSchema,
  type TokenSchema,
} from "~/schemas/server";

export type Response = {
  id: string;
  tokens: TokenOutput[];
};

export type TokenPlatformFormat = {
  name: string;
  value: string;
};

export type PlatformOutput = {
  name: string;
  formats?: TokenPlatformFormat[];
  error?: string;
};

export type TokenOutput = {
  namespace?: string;
  platforms?: PlatformOutput[];
  error?: string;
};

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type TransformGroup = ArrayElement<typeof transformGroup>;

export type Format = ArrayElement<typeof formats>;

export type Platform = z.infer<typeof PlatformSchema>;

export type Platforms = Platform[];

export type Tokens = z.infer<typeof TokensSchema>;

export type Token = z.infer<typeof TokenSchema>;

export type Transform = ArrayElement<typeof transforms>;
