import { useMemo } from "react";
import { Octokit } from "octokit";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function useGitHubApi() {
  const { state } = useStateManagement();
  const { authToken } = state;

  const octokit = useMemo(() => {
    return new Octokit({ auth: authToken });
  }, [authToken]);

  return octokit;
}
