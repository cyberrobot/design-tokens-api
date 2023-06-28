import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import _get from "lodash/get";
import { type DesignToken } from "style-dictionary/types/DesignToken";
import { buildTokens } from "~/utils/build-file";
import { getErrorOutput, getTokenOutput } from "~/utils/get-output";
import { getDbRowById } from "~/utils/get-db-row-by-id";
import { removeFiles } from "~/utils/remove-file";

type Response = {
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
  namespace: string;
  platforms?: PlatformOutput[];
  error?: string;
};

const transformGroup = [
  "web",
  "js",
  "scss",
  "css",
  "less",
  "html",
  "android",
  "compose",
  "ios",
  "ios-swift",
  "ios-swift-separate",
  "assets",
  "flutter",
  "flutter-separate",
  "react-native",
] as const;

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type TransformGroup = ArrayElement<typeof transformGroup>;

// export type Transform = "scss" | "css";

const transforms = [
  "attribute/cti",
  "attribute/color",
  "name/human",
  "name/cti/camel",
  "name/ti/camel",
  "name/cti/kebab",
  "name/cti/snake",
  "name/cti/constant",
  "name/ti/constant",
  "name/cti/pascal",
  "color/rgb",
  "color/hsl",
  "color/hsl-4",
  "color/hex",
  "color/hex8",
  "color/hex8android",
  "color/composeColor",
  "color/UIColor",
  "color/UIColorSwift",
  "color/ColorSwiftUI",
  "color/css",
  "color/sketch",
  "size/sp",
  "size/dp",
  "size/object",
  "size/remToSp",
  "size/remToDp",
  "size/px",
  "size/rem",
  "size/remToPt",
  "size/compose/remToSp",
  "size/compose/remToDp",
  "size/compose/em",
  "size/swift/remToCGFloat",
  "size/remToPx",
  "size/pxToRem",
  "content/icon",
  "content/quote",
  "content/objC/literal",
  "font/objC/literal",
  "font/swift/literal",
  "time/seconds",
  "asset/base64",
  "asset/path",
  "asset/objC/literal",
  "asset/swift/literal",
  "color/hex8flutter",
  "content/flutter/literal",
  "asset/flutter/literal",
  "font/flutter/literal",
  "size/flutter/remToDouble",
] as const;

// type Transform = ArrayElement<typeof transforms>;

const formats = [
  "css/variables",
  "scss/map-flat",
  "scss/map-deep",
  "scss/variables",
  "scss/icons",
  "less/variables",
  "less/icons",
  "stylus/variables",
  "javascript/module",
  "javascript/module-flat",
  "javascript/object",
  "javascript/umd",
  "javascript/es6",
  "typescript/es6-declarations",
  "typescript/module-declarations",
  "android/resources",
  "android/colors",
  "android/dimens",
  "android/fontDimens",
  "android/integers",
  "android/strings",
  "compose/object",
  "ios/macros",
  "ios/plist",
  "ios/singleton.m",
  "ios/singleton.h",
  "ios/static.h",
  "ios/static.m",
  "ios/colors.h",
  "ios/colors.m",
  "ios/strings.h",
  "ios/strings.m",
  "ios-swift/class.swift",
  "ios-swift/enum.swift",
  "ios-swift/any.swift",
  "css/fonts.css",
  "json",
  "json/asset",
  "json/nested",
  "json/flat",
  "sketch/palette",
  "sketch/palette/v2",
  "flutter/class.dart",
] as const;

export type Format = ArrayElement<typeof formats>;

const PlatformSchema = z.object({
  name: z.string(),
  transformGroup: z.enum(transformGroup).optional(),
  transforms: z.array(z.enum(transforms)).optional(),
  formats: z.array(z.enum(formats)).optional(),
});

const TokenSchema = z.object({
  namespace: z.string(),
  platforms: z.array(PlatformSchema),
});

const TokensSchema = z.array(TokenSchema);

export type Platform = z.infer<typeof PlatformSchema>;

export type Platforms = Platform[];

export type Tokens = z.infer<typeof TokensSchema>;

export type Token = z.infer<typeof TokenSchema>;

export const getToken = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tokens: TokensSchema,
      })
    )
    .query(async ({ input }) => {
      if (input.id && input.tokens) {
        console.log("Input", input);
        const buildPath = `build/${input.id}/`;
        const row = await getDbRowById(input.id);
        if (row) {
          const response: Response = {
            id: input.id,
            tokens: [],
          };

          for (const token of input.tokens) {
            const rawToken = _get(
              JSON.parse(row.file),
              token.namespace
            ) as DesignToken;
            if (rawToken) {
              buildTokens({
                token: rawToken,
                platforms: token.platforms,
                buildPath,
              });
              const output = getTokenOutput({
                token,
                buildPath: buildPath,
              });
              response.tokens.push(output);
              removeFiles(buildPath);
            } else {
              const errorOutput = getErrorOutput({
                namespace: token.namespace,
              });
              response.tokens.push(errorOutput);
            }
          }
          return response;
        }
      }
      // TODO: Add input validation for non-tRPC requests
      return null;
    }),
});
