import { Suspense, useState } from "react";
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
} from "@mdi/js";
import { Repos } from "./repos";
import Tabs from "@/components/tabs";
import Link from "next/link";
import { Collections } from "./collections";
import { Items } from "./items";
import { Button } from "../button";
import DropDown from "../dropdown";

export default function SideBar({}) {
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
              content: <Collections />,
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

        <div className={styles.footer}>
          <Button
            title="About UI CMS"
            // onClick={() => router.push("/repo/new")}
            // className={styles.addButton}
          >
            <Icon path={mdiHelpCircleOutline} size={0.75} className="mr-1" />
          </Button>
          <Button
          // pass index of active tab (repo, collection, item)
          // based on that change button text and content
          // onClick={() => router.push("/repo/new")}
          // className={styles.addButton}
          >
            <Icon path={mdiPlus} size={0.75} className="mr-1" />
            New collection
          </Button>
        </div>
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
                <li>{currentUser.login}</li>
                <li>
                  <a
                    href={currentUser.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub profile
                  </a>
                </li>
                <li>
                  <Link href="/signOut">Sign out</Link>
                </li>
              </ul>
            </DropDown>
          </div>
        </div>
      )}
    </nav>
  );
}
