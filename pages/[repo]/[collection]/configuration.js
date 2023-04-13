import { useRouter } from "next/router";
import Page from "@/components/page";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { TextInputWithLabel } from "../configuration";

export default function CollectionConfiguration() {
  const router = useRouter();
  const repoId = router.query.repo;
  const collectionId = router.query.collection;
  const isNew = collectionId?.toLowerCase() === "new"; // when creating new collection. url path: /repoId/new/configuration
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(isNew);
  const [repo, setRepo] = useState(null);
  const [collection, setCollection] = useState(null);
  const [configData, setConfigData] = useState(null); // local one
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // Load the repo that owns this collection from state management
  useEffect(() => {
    if (repoId && state.repos.length) {
      const _repo = state.repos.find((r) => r.id === Number(repoId));
      if (_repo && collectionId) {
        if (_repo.config.data) {
          const _collection = isNew
            ? {}
            : _repo.config.data.collections.find((c) => c.id === collectionId);
          if (_collection) {
            setRepo(_repo);
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

  const save = async () => {
    confirm("Are you sure");
  };

  function onChange(e) {
    const { name, value } = e;
    setConfigData({ ...configData, [name]: value });
  }

  function cancel() {
    setConfigData(collection);
    setEditMode(false);
  }

  function hasChanges() {
    return JSON.stringify(collection) !== JSON.stringify(configData);
  }

  function initConfig() {
    // setConfigData({ ...UICMS_CONFIG_TEMPLATE });
    setEditMode(true);
  }

  return (
    <Page
      title={isNew ? "New collection" : "Collection configuration"}
      loading={loading}
      heading={{
        title: isNew ? "New collection" : collection?.name,
        subtitle: !isNew && "Configuration",
        extra: editMode ? (
          <>
            {!isNew && <Button onClick={cancel}>Cancel</Button>}
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
      {configData && (
        <fieldset disabled={!editMode}>
          <TextInputWithLabel
            name="collection.name"
            value={configData.name}
            onChange={onChange}
            label="Collection name"
            placeholder="Articles"
            required={true}
          />
          <TextInputWithLabel
            name="collection.path"
            value={configData.path}
            onChange={onChange}
            label="Path"
            placeholder="/articles"
            help="Path where items of this collection will be saved as files."
            required={true}
          />
        </fieldset>
      )}

      <pre>{JSON.stringify(collection, null, 4)}</pre>
    </Page>
  );
}
