import Loader from "../loader";
import styles from "@/styles/SideBar.module.scss";
import { useEffect, useState } from "react";
import { UICMS_CONFIGS } from "@/helpers/constants";
import useStateManagement from "@/services/stateManagement/stateManagement";
import useGitHubApi from "@/hooks/useGitHubApi";

export function Collections({ repo, setRepo }) {
  const [loading, setLoading] = useState(false);
  const getRepoConfig = useGetRepoConfig(setLoading);

  // Fetch config of repo if not present
  useEffect(() => {
    if (!repo.config.data) {
      (async () => {
        const _repo = await getRepoConfig(repo);
        setRepo(_repo);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // need to run only once

  return loading ? (
    <Loader />
  ) : (
    <section className={styles.repos}>
      <ul>
        {!repo.config.data ? (
          <li className="pl-4">
            This repo is not configigured to work with UI CMS
          </li>
        ) : repo.config.data.collections.length === 0 ? (
          <li className="pl-4">No collections found</li>
        ) : (
          repo.config.data.collections.map((c) => <li key={c.id}>{c.name}</li>)
        )}
      </ul>
    </section>
  );
}

export function useGetRepoConfig(loadingCallback) {
  const { dispatchAction } = useStateManagement();
  const githubApi = useGitHubApi();

  async function getRepoConfig(repo) {
    const _repo = { ...repo };
    if (loadingCallback) loadingCallback(true);
    try {
      const res = await githubApi.customRest.getFileContentAndSha(
        repo.owner,
        repo.name,
        UICMS_CONFIGS.fileName
      );
      _repo.config = { sha: res.sha, data: JSON.parse(res.content) };
      dispatchAction.updateRepo(_repo);
    } catch (e) {
      // when 404, no config file, incompatible repo
      if (e.status !== 404) {
        displayError("Error fetching config file!", e);
      }
    } finally {
      if (loadingCallback) loadingCallback(false);
    }
    return _repo;
  }

  return getRepoConfig;
}
