import { useRouter } from "next/router";
import Page from "@/components/page";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";

export default function CollectionConfiguration() {
  const router = useRouter();
  const repoId = router.query.repo;
  const collectionId = router.query.collection;
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [collection, setCollection] = useState(null);
  const [configData, setConfigData] = useState(null); // local one
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // Load the repo that owns this collection from state management
  useEffect(() => {
    if (repoId && state.repos.length) {
      const repo = state.repos.find((r) => r.id === Number(repoId));
      if (repo && collectionId) {
        if (repo.config.data) {
          const _collection = repo.config.data.collections.find(
            (c) => c.id === collectionId
          );
          if (_collection) {
            setCollection(_collection);
            setConfigData(_collection);
            setLoading(false);
          } else {
            router.push("/404");
          }
        }
      } else {
        router.push("/404");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId, state.repos]); // only trigger when collection or repos changes

  return (
    <Page
      title="Collection configuration"
      loading={loading}
      heading={{
        title: collection?.name,
        subtitle: "Configuration",
        extra: editMode ? (
          <>
            <Button onClick={cancel}>Cancel</Button>
            <Button
              type="primary"
              className="ml-2"
              onClick={save}
              disabled={!hasChanges()}
            >
              Save
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)}>Edit</Button>
        ),
      }}
    >
      <pre>{JSON.stringify(collection, null, 4)}</pre>
    </Page>
  );
}
