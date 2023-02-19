import Page from "@/components/page";
import { displayError, orderBy } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useRef, useState } from "react";
import { MdLock } from "react-icons/md";

export default function Repos() {
  const loading = useRef(false);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos } = state;

  useEffect(() => {
    if (state.currentUser && repos.length === 0 && !loading.current) {
      (async () => {
        loading.current = true;
        try {
          const res = await githubApi.customRest.listAuthenticatedUsersRepos();
          orderBy(res.data, "pushed_at", false);
          dispatchAction.setRepos(res.data);
        } catch (e) {
          displayError("Error fetching authenticated user's repos!", e);
        } finally {
          loading.current = false;
        }
      })();
    }
  }, [
    dispatchAction,
    githubApi.customRest,
    loading,
    repos.length,
    state.currentUser,
  ]);

  return (
    <Page title="My repos">
      <h1>Repos</h1>
      Default repository:
      <h1>Other repositories(hidden)</h1>
      <br />
      <hr />
      <br />
      
      <ul>
        {repos.length > 0 &&
          repos.map((repo, index) => {
            return (
              <li key={repo.id}>
                {index + 1}. {repo.name}{" "}
                {repo.private && (
                  <span className="icon">
                    <MdLock />
                  </span>
                )}
              </li>
            );
          })}
      </ul>
    </Page>
  );
}
