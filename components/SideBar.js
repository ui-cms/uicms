import { Suspense, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "./layout/page";
import styles from "@/styles/SideBar.module.scss";
import Image from "next/image";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Tabs from "./tabs/tabs";

export default function SideBar({}) {
  const [open, setOpen] = useState(false);
  const { state } = useStateManagement();
  const { currentUser } = state;
  const router = useRouter();
  return (
    <Suspense fallback={<Loader />}>
      <aside className={styles.sidebar}>
        <nav className={styles.header}>
          <i onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</i>
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
                  <a onClick={() => router.push("/signOut")}>Sign out</a>
                </li>
              </ul>
            )}
          </details>
        </nav>
        <secion className={`${styles.main} ${open ? styles.open : ""}`}>
        <Tabs
        tabs={[
          { title: "Repos", content: <h1>Repos list</h1> },
          { title: "Collections", content: <h1>Collections list</h1> },
          { title: "Items", content: <h1>Items list</h1> },
        ]}
      />
          <ul>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
          </ul>
        </secion>
      </aside>
    </Suspense>
  );
}
