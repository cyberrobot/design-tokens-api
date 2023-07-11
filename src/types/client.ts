import { type Endpoints } from "@octokit/types";

export type GitHubResponse =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];
