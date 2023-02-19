import { useMemo } from "react";
import { Octokit } from "octokit";
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
}
