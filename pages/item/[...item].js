import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CollectionItem() {
  const router = useRouter();
  const [repoOwner, repoName, collectionName, itemSlug] = router.query.item || [];
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const [repo, setRepo] = useState(null);
  const [config, setConfig] = useState(null);
  const [item, setItem] = useState(null);

  // Initial fetch repo from state management
  useEffect(() => {
    let _config = null;
    if (state.repos.length > 0 && repoOwner && repoName) {
      const _repo = state.repos.find(
        (r) => r.owner === repoOwner && r.name === repoName
      );
      if (_repo) {
        setRepo(_repo);
        _config = _repo.collections.find((c) => c.name === collectionName);
        setConfig(_config);
      }
    }

    // If landed directly to this page and repos have not been loaded to state management yet, redirect to repos page
    if (_config) {
      router.push("/repos");
    }
  }, [collectionName, repoName, repoOwner, router, state.repos]);

  useEffect(() => {
    if (!item && loading) {
      // fetch here
    }
  }, []);

  return <pre>{JSON.stringify(router.query.item)}</pre>;
}
