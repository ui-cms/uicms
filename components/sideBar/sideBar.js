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

export default function SideBar({}) {
  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [open, setOpen] = useState(false); // used in mobile

  return (
    <aside className={styles.sidebar}>
      <Header open={open} setOpen={setOpen} />
      <section className={`${styles.main} ${open ? styles.open : ""}`}>
        <MainWithTabs
          setActiveTabIndex={setActiveTabIndex}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
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

function MainWithTabs({
  setActiveTabIndex,
  selectedRepo,
  setSelectedRepo,
  selectedCollection,
  setSelectedCollection,
}) {
  const router = useRouter();
  const url = {
    repoId: router.query.repo,
    collectionId: router.query.collection,
    itemSlug: router.query.item,
  };
  const [loading, setLoading] = useState(false);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos } = state;

  // Repos in state is updated, so update selected repo as well (as it might be updated in state.repos)
  useEffect(() => {
    if (repos.length) {
      const repoId = selectedRepo ? selectedRepo.id : url.repoId; // when landed from url, will use repoId from url initially as there won't be a selected repo
      if (repoId) {
        const repo = repos.find((r) => r.id === Number(repoId));
        if (repo) {
          let collection = null;
          if (url.collectionId && repo.config.data) {
            const collectionId = selectedCollection
              ? selectedCollection.id
              : url.collectionId; // when landed from url, will use collectionId from url initially to set selected collection
            collection = repo.config.data.collections.find(
              (c) => c.id === collectionId
            );
          }
          setSelectedRepo(repo);
          setSelectedCollection(collection); // if none, will clear selected collection
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos]); // trigger only when repos in state gets updated

  // Whenever there is a repoId present (changed) in url, selected repo's config must be fetched. That is how fetching config is triggered.
  useEffect(() => {
    if (
      selectedRepo &&
      url.repoId &&
      selectedRepo.id === Number(url.repoId) &&
      !selectedRepo.config.data
    ) {
      (async () => {
        const repo = { ...selectedRepo };
        setLoading(true);
        try {
          const res = await githubApi.customRest.getFileContentAndSha(
            repo.owner,
            repo.name,
            UICMS_CONFIGS.fileName
          );
          repo.config = { sha: res.sha, data: JSON.parse(res.content) };
          dispatchAction.updateRepo(repo);
        } catch (e) {
          // when 404, no config file, incompatible repo
          if (e.status !== 404) {
            displayError("Error fetching config file!", e);
          }
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo, url.repoId]); // trigger only when selected repo or repoId in url changes

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
          content: (
            <Repos
              selectedRepo={selectedRepo}
              selectRepo={(repo) => {
                setSelectedRepo(repo);
                setSelectedCollection(null);
              }}
              setLoading={setLoading}
            />
          ),
        },
        {
          title: (
            <>
              <Icon path={mdiFolderOutline} size={0.8} className="mr-1" />
              Collections
            </>
          ),
          content: (
            <Collections
              repo={selectedRepo}
              selectedCollection={selectedCollection}
              selectCollection={(collection) => {
                setSelectedCollection(collection);
                // setSelectedItem(null);
              }}
            />
          ),
          disabled: !selectedRepo,
          onClick: () => router.push(`/${selectedRepo?.id}`),
        },
        {
          title: (
            <>
              <Icon path={mdiFileDocumentOutline} size={0.8} className="mr-1" />
              Items
            </>
          ),
          content: <Items />,
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
        size={1}
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
                  width="28"
                  height="28"
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
    if (activeTabIndex === 1) {
      result.text = "New collection";
      result.url = `/${repoId}/collection/new`;
    } else if (activeTabIndex === 2) {
      result.text = "New item";
      result.url = `/${repoId}/${collectionId}/item/new`;
    }
    return result;
  }, [activeTabIndex, collectionId, repoId]);

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
