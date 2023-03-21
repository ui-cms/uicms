import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";

export default function Item() {
  const router = useRouter();
  let [repoId, collectionId, itemSlug] = router.query.item || [];
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const [repo, setRepo] = useState(null);
  const [config, setConfig] = useState(null); // collection config
  const [item, setItem] = useState(null);

  // Initial fetch repo from state management
  useEffect(() => {
    let _config = null;
    if (state.repos.length > 0 && repoId) {
      const _repo = state.repos.find(
        (r) => r.id === repoId
      );
      if (_repo) {
        setRepo(_repo);
        _config = _repo.configFile.data.collections.find(
          (c) => c.id === collectionId
        );
        setConfig(_config);
      }
    }

    // // If landed directly to this page and repos have not been loaded to state management yet, redirect to repos page
    // if (!_config) {
    //   router.push("/repos");
    // }
  }, [collectionId, repoId, router, state.repos]);

  // // inital fetch
  // useEffect(() => {
  //   if (!item && loading) {
  //     // fetch here
  //   }
  // }, []);

  return (
    <Page title="Item">
      <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" />

      <pre>{JSON.stringify(router.query.item)}</pre>
      <br />
    </Page>
  );
}
