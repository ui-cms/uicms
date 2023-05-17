import { useMemo } from "react";
import { Octokit } from "octokit";
import { Base64 } from "js-base64";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function useGitHubApi() {
  const { state } = useStateManagement();
  const { authToken } = state;

  const result = useMemo(() => {
    const octokit = new Octokit({ auth: authToken });
    const customRest = new CustomRest(octokit);
    return { rest: octokit.rest, customRest };
  }, [authToken]);

  return result;
}

class CustomRest {
  constructor(octokit) {
    this.octokit = octokit;
  }

  listAuthenticatedUsersRepos() {
    return this.octokit.request("GET /user/repos", {});
  }

  /**
   * Will get content and SHA blob of a file by auto adjusting Api call.
   * The endpoint in GitHub Api has limitations: a file's content of max 1mb can be encoded, if file size is more than 1mb then must fetch in raw.
   * When fetched in raw, there is no SHA returned, which is needed when updating a file's content.
   * If no SHA required, then octokit function can be used directly.
   * For more information see https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
   */
  async getFileContentAndSha(owner, repo, path) {
    const result = { sha: null, content: null, error: null };

    const res = await this.octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
    });

    // file size is less than 1mb, decode encoded content
    if (res.data.content && res.data.encoding === "base64") {
      result.content = Base64.decode(res.data.content); // built-in js decoding function (window.atob) won't work with non-latin chars
    } else {
      // file size is more than 1mb, fetch raw content
      const res2 = await this.octokit.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: path,
        mediaType: {
          format: "raw",
        },
        headers: {
          "If-None-Match": "", // disable chaching
        },
      });
      result.content = res2.data;
    }
    result.sha = res.data.sha;
    return result;
  }
}
