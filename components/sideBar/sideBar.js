import { useMemo, useState } from "react";
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

export default function SideBar({}) {
  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [open, setOpen] = useState(false); // used in mobile
  const { state } = useStateManagement();
  const { currentUser } = state;

  function selectRepo(repo) {
    setSelectedCollection(null);
    setSelectedRepo(repo);
  }

  return (
    <aside className={styles.sidebar}>
      <Header currentUser={currentUser} open={open} setOpen={setOpen} />
      <section className={`${styles.main} ${open ? styles.open : ""}`}>
        <Tabs
          className={styles.tabs}
          onTabClick={setActiveTabIndex}
          tabs={[
            {
              title: (
                <>
                  <Icon path={mdiFileCabinet} size={0.8} className="mr-1" />
                  Repos
                </>
              ),
              content: (
                <Repos selectedRepo={selectedRepo} selectRepo={selectRepo} />
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
                <Collections repo={selectedRepo} setRepo={setSelectedRepo} />
              ),
              disabled: !selectedRepo,
            },
            {
              title: (
                <>
                  <Icon
                    path={mdiFileDocumentOutline}
                    size={0.8}
                    className="mr-1"
                  />
                  Items
                </>
              ),
              content: <Items />,
              disabled: !selectedCollection,
            },
          ]}
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

function Header({ open, setOpen, currentUser }) {
  return (
    <nav className={styles.header}>
      <Icon
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
        path={open ? mdiClose : mdiMenu}
        size={1}
      />
      <span className={styles.brand}>UI CMS</span>

      {currentUser && (
        <div className={styles.user}>
          <div className="position-absolute">
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
              <ul>
                <li>
                  <Link href={currentUser.html_url} target="_blank">
                    <Icon path={mdiGithub} size={0.75} className="mr-1" />
                    {currentUser.login}
                  </Link>
                </li>
                <li>
                  <Link href="/signOut">
                    <Icon path={mdiLogout} size={0.75} className="mr-1" />
                    Sign out
                  </Link>
                </li>
              </ul>
            </DropDown>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer({ activeTabIndex, repoId, collectionId }) {
  const router = useRouter();

  const newBtn = useMemo(() => {
    const result = { text: "New repo", url: "/repo/new" };
    if (activeTabIndex === 1) {
      result.text = "Add collection";
      result.url = `/collection/${repoId}`;
    } else if (activeTabIndex === 2) {
      result.text = "Add item";
      result.url = `/${repoId}/${collectionId}`;
    }
    return result;
  }, [activeTabIndex, collectionId, repoId]);

  return (
    <div className={styles.footer}>
      <Button
        title="About UI CMS"
        // onClick={() => router.push("/repo/new")}
        // className={styles.addButton}
      >
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
