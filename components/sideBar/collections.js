import Loader from "../loader";
import styles from "@/styles/SideBar.module.scss";
import { useCallback, useEffect, useState } from "react";
import { UICMS_CONFIGS } from "@/helpers/constants";
import useStateManagement from "@/services/stateManagement/stateManagement";
import useGitHubApi from "@/hooks/useGitHubApi";
import { Button } from "../button";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiCheck,
  mdiCogOutline,
  mdiDeleteOutline,
  mdiDotsVertical,
  mdiFolderCheckOutline,
  mdiFolderOutline,
} from "@mdi/js";
import DropDown from "../dropdown";

export function Collections({
  repo,
  setRepo,
  selectedCollection,
  selectCollection,
}) {
  const [loading, setLoading] = useState(false);
  const getRepoConfig = useGetRepoConfig();

  // Fetch config of repo if not present
  useEffect(() => {
    if (!repo.config.data) {
      (async () => {
        const _repo = await getRepoConfig(repo, setLoading);
        setRepo(_repo);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // need to run only once

  return loading ? (
    <Loader />
  ) : (
    <>
      <SelectedCollectionDetails
        repoId={repo.id}
        collection={selectedCollection}
      />
      <CollectionList
        repoId={repo.id}
        data={repo.config.data}
        selectedCollectionId={selectedCollection?.id}
        onSelect={selectCollection}
      />
    </>
  );
}

function SelectedCollectionDetails({ collection, repoId }) {
  return (
    collection && (
      <div className={styles.selectedArea}>
        <h3 title={collection.name}>
          <p className="mb-1">
            <Icon
              path={mdiFolderCheckOutline}
              size={1.15}
              className="mr-1 text-dark"
            />
            <span className="text-overflow">{collection.name}</span>
          </p>
        </h3>
        <div className={styles.dropdown}>
          <DropDown
            direction="right"
            handle={
              <Button onClick={() => {}} title="More options">
                <Icon path={mdiDotsVertical} size={0.95} />
              </Button>
            }
          >
            <div className={styles.dropdownOptions}>
              <Link href={`/${repoId}/${collection.id}/settings`}>
                <Icon path={mdiCogOutline} size={0.7} className="mr-1" />
                Configuration
              </Link>
              <a onClick={() => alert("todo")} href="#">
                <Icon path={mdiDeleteOutline} size={0.7} className="mr-1" />
                Delete
              </a>
            </div>
          </DropDown>
        </div>
      </div>
    )
  );
}

function CollectionList({ repoId, data, selectedCollectionId, onSelect }) {
  return !data ? (
    <p>
      <h4 className="mb-3">Incompatible repo!</h4>
      This repo is missing <code>{UICMS_CONFIGS.fileName}</code> file in the
      root directory. That means this repo hasn&apos;t been configured to work
      with UICMS.
      <p className="mt-4">
        Would you like to set UICMS up in this repo ?
        <Link href={`/${repoId}/settings`} className="d-block mt-1">
          Let&apos;s do it!
        </Link>
      </p>
    </p>
  ) : data.collections.length === 0 ? (
    <p>No collections found</p>
  ) : (
    <ul className={styles.listArea}>
      {data.collections.map((c) => {
        const selected = c.id === selectedCollectionId;
        return (
          <li key={c.id}>
            <a
              onClick={() => onSelect(selected ? null : c)}
              className={selected ? styles.active : ""}
              href="#"
            >
              <Icon path={mdiFolderOutline} size={0.75} className="mr-1" />
              <span className="text-overflow" title={c.name}>
                {c.name}
              </span>
              {selected && (
                <Icon
                  path={mdiCheck}
                  size={0.75}
                  className="ml-1"
                  title="Selected collection"
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function useGetRepoConfig() {
  const { dispatchAction } = useStateManagement();
  const githubApi = useGitHubApi();

  const getRepoConfig = useCallback(async (repo, loadingCallback) => {
    const _repo = { ...repo };
    loadingCallback && loadingCallback(true);
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
      loadingCallback && loadingCallback(false);
    }
    return _repo;
  }, [dispatchAction, githubApi.customRest]);

  return getRepoConfig;
}
