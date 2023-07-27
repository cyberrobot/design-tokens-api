export type { Tokens } from "~/types/server";
import { type Endpoints } from "@octokit/types";
import { type Token } from "~/types/server";

export type ContentsRepoResponseData =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

export type TTokenImport = {
  name: string;
  description: string;
  content: string;
};

export interface ITokenImportStore extends TTokenImport {
  updateToken: (token: Partial<TTokenImport>) => void;
}

export type TInputState = {
  id: string;
  tokens: Token[];
};

export type ITokenTransformStore = {
  id: string;
  tokens: Token[];
  updateState: (state: TInputState) => void;
};

export type TSelect<T> = {
  defaultValues: T[];
};

export type FileExtensions = {
  [key: string]: string | undefined;
};
