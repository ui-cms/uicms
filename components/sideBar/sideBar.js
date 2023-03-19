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
} from "@mdi/js";
import { Repos } from "./repos";
import Loader from "@/components/loader";
import Tabs from "@/components/tabs";
import Link from "next/link";

export default function SideBar({}) {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [open, setOpen] = useState(false); // used in mobile
  const { state } = useStateManagement();
  const { currentUser } = state;

  return (
    <Suspense fallback={<Loader />}>
      <aside className={styles.sidebar}>
        <nav className={styles.header}>
          <Icon
            className={styles.menuToggle}
            onClick={() => setOpen(!open)}
            path={open ? mdiClose : mdiMenu}
            size={1}
          />
          <span className={styles.brand}>UI CMS</span>

          <details className={styles.user}>
            <summary>
              {currentUser && (
                <Image
                  src={currentUser.avatar_url}
                  width="32"
                  height="32"
                  alt="username"
                />
              )}
            </summary>
            {currentUser && (
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
            )}
          </details>
        </nav>
        <secion className={`${styles.main} ${open ? styles.open : ""}`}>
          <Tabs
            tabs={[
              {
                title: (
                  <>
                    <Icon path={mdiFileCabinet} size={0.8} className="mr-1" />
                    Repos
                  </>
                ),
                content: <Repos />,
              },
              {
                title: (
                  <>
                    <Icon path={mdiFolderOutline} size={0.8} className="mr-1" />
                    Collections
                  </>
                ),
                content: <h1>Collections list</h1>,
                // loading: true,
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
                content: <h1>Items list</h1>,
                // disabled: true,
              },
            ]}
          />
        </secion>
      </aside>
    </Suspense>
  );
}
