import { Suspense, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "./layout/page";
import styles from "@/styles/SideBar.module.scss";
import Image from "next/image";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function SideBar({}) {
  const [open, setOpen] = useState(false);
  const { state } = useStateManagement();
  const { currentUser } = state;
  const router = useRouter();
  return (
    <Suspense fallback={<Loading />}>
      <aside className={styles.sidebar}>
        <nav className={styles.header}>
          <i onClick={() => setOpen(!open)}>☰</i>
          <span className={styles.brand}>UI CMS</span>

          {currentUser && (
            <details className={styles.user}>
              <summary>
                <Image
                  src={currentUser.avatar_url}
                  width="32"
                  height="32"
                  alt="username"
                />
              </summary>
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
            </details>
          )}
        </nav>
        <secion className={`${styles.main} ${open ? styles.open : ""}`}>
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
