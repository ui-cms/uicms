import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/SideBar.module.scss";
import Image from "next/image";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Icon from "@mdi/react";
import {
  mdiFolderOutline,
  mdiFileDocumentOutline,
  mdiFileCabinet,
  mdiMenu,
  mdiClose,
  mdiPlus,
  mdiHelpCircleOutline,
  mdiLogout,
  mdiGithub,
} from "@mdi/js";
import { Repos } from "./repos";
import Tabs from "@/components/tabs";
import Link from "next/link";
import { Collections } from "./collections";
import { Items } from "./items";
import { Button } from "../button";
import DropDown from "../dropdown";
import { useRouter } from "next/router";
import { UICMS_CONFIGS } from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import { RepoConfigFile } from "@/helpers/models";

export default function SideBar({}) {
  const router = useRouter();
  const url = {
    repoId: Number(router.query.repo),
    collectionId: Number(router.query.collection),
  };
  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [open, setOpen] = useState(false); // used in mobile
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos, items, selectedRepo, selectedCollection } = state;

  // Whenever there is a repoId present (changed) in url, selected repo's config must be fetched (if it isn't present already). That is how fetching config is triggered.
  // Because all pages like repo config, collection config, new collection, item has url that starts with repo id and they all need repo (config) to be loaded.
  // When repos in state gets updated, selected repo as well should be updated (as it might be updated in state management).
  useEffect(() => {
    async function fetchConfig(repo) {
      try {
        const res = await githubApi.customRest.getFileContentAndSha(
          repo.owner,
          repo.name,
          UICMS_CONFIGS.fileName
        );
        dispatchAction.updateRepo({
          ...repo,
          config: new RepoConfigFile(JSON.parse(res.content), res.sha),
        });
      } catch (e) {
        // when 404, no config file, incompatible repo
        if (e.status !== 404) {
          displayError("Error fetching config file!", e);
        }
      }
    }

    if (repos.length && url.repoId) {
      const repo = repos.find((r) => r.id === url.repoId);
      if (repo) {
        dispatchAction.setSelectedRepo(repo);
        if (!repo.config.data) {
          fetchConfig(repo);
        }
      } else {
        router.push("/404");
      }
    } else if (selectedRepo) {
      dispatchAction.setSelectedRepo(null); // reset/unselect selected repo
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos, url.repoId]); // trigger only when repos in state gets updated or repoId in url changes

  // When selected repo's config changes or collectionId from url changes, selected collection should be changed too.
  useEffect(() => {
    async function fetchItems(repo, collection) {
      try {
        const res = await githubApi.rest.repos.getContent({
          owner: repo.owner,
          repo: repo.name,
          path: `${repo.config.data.collectionsDirectory}/${collection.path}`, // todo slash check
        });

        const itemSlugs = res.data.reduce((acc, item) => {
          if (item.type === "dir") {
            acc.push(item.name); // only directories (skip files)
          }
          return acc;
        }, []);

        dispatchAction.setItems(repo.id, collection.id, itemSlugs);
      } catch (e) {
        // when 404, dir/path not found
        if (e.status !== 404) {
          displayError("Error fetching items!", e);
        }
      }
    }

    if (selectedRepo?.config.data && url.collectionId) {
      const collection = selectedRepo.config.data.collections.find(
        (c) => c.id === url.collectionId
      );
      if (collection) {
        dispatchAction.setSelectedCollection(collection);
        if (!items[selectedRepo.id]?.[collection.id]) {
          fetchItems(selectedRepo, collection); // if items not fetched already
        }
      } else {
        router.push("/404");
      }
    } else if (selectedCollection) {
      dispatchAction.setSelectedCollection(null); // reset/unselect selected collection
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo?.config.data, url.collectionId]); // trigger only when selected repo's config data gets updated or collectionId in url changes

  return (
    <aside className={styles.sidebar}>
      <Header open={open} setOpen={setOpen} />
      <section className={`${styles.main} ${open ? styles.open : ""}`}>
        <MainWithTabs
          setActiveTabIndex={setActiveTabIndex}
          selectedRepo={selectedRepo}
          selectedCollection={selectedCollection}
        />
        <Footer
          activeTabIndex={activeTabIndex}
          repoId={selectedRepo?.id}
          collectionId={selectedCollection?.id}
        />
      </section>
    </aside>
  );
}

function MainWithTabs({ setActiveTabIndex, selectedRepo, selectedCollection }) {
  const [loading, setLoading] = useState(false);

  return (
    <Tabs
      className={styles.tabs}
      tabClickCallback={setActiveTabIndex}
      loading={loading}
      tabs={[
        {
          title: (
            <>
              <Icon path={mdiFileCabinet} size={0.8} className="mr-1" />
              Repos
            </>
          ),
          content: <Repos setLoading={setLoading} />,
        },
        {
          title: (
            <>
              <Icon path={mdiFolderOutline} size={0.8} className="mr-1" />
              Collections
            </>
          ),
          content: selectedRepo && <Collections />,
          disabled: !selectedRepo,
        },
        {
          title: (
            <>
              <Icon path={mdiFileDocumentOutline} size={0.8} className="mr-1" />
              Items
            </>
          ),
          content: selectedCollection && <Items />,
          disabled: !selectedCollection,
        },
      ]}
    />
  );
}

function Header({ open, setOpen }) {
  const { state } = useStateManagement();
  const { currentUser } = state;

  return (
    <nav className={styles.header}>
      <Icon
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
        path={open ? mdiClose : mdiMenu}
        size={1.1}
      />
      <span className={styles.brand}>UI CMS</span>

      <div className={styles.user}>
        <div className="position-absolute">
          {currentUser && (
            <DropDown
              direction="right"
              handle={
                <Image
                  src={currentUser.avatar_url}
                  width="24"
                  height="24"
                  alt="username"
                />
              }
            >
              <div className={styles.dropdownOptions}>
                <Link href={currentUser.html_url} target="_blank">
                  <Icon path={mdiGithub} size={0.75} className="mr-1" />
                  {currentUser.login}
                </Link>
                <Link href="/signOut">
                  <Icon path={mdiLogout} size={0.75} className="mr-1" />
                  Sign out
                </Link>
              </div>
            </DropDown>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer({ activeTabIndex, repoId, collectionId }) {
  const router = useRouter();

  const newBtn = useMemo(() => {
    const result = { text: "New repo", url: "/repo/new" };
    if (activeTabIndex === 1 && repoId) {
      result.text = "New collection";
      result.url = `/${repoId}/0/configuration`; // 0 (as id) for new collection
    } else if (activeTabIndex === 2 && collectionId) {
      result.text = "New item";
      result.url = `/${repoId}/${collectionId}/item/new`;
    }
    return result;
  }, [activeTabIndex, repoId, collectionId]);

  return (
    <div className={styles.footer}>
      <Button title="About UI CMS" onClick={() => alert("todo")}>
        <Icon path={mdiHelpCircleOutline} size={0.75} className="mr-1" />
      </Button>
      {!isNaN(activeTabIndex) && (
        <Button onClick={() => router.push(newBtn.url)}>
          <Icon path={mdiPlus} size={0.75} className="mr-1" />
          {newBtn.text}
        </Button>
      )}
    </div>
  );
}
