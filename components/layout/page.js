import Head from "next/head";
import styles from "@/styles/Layout.module.scss";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/router";

export default function Page({
  children,
  authProtected = true,
  loading = false,
  title = "UI CMS",
  description = "Simple yet powerful gitbased CMS",
}) {
  const router = useRouter();
  const { state } = useStateManagement();
  const { currentUser } = state;

  useEffect(() => {
    // if current page is protected then redirect to home page along with source page's url path as redirect param
    if (authProtected && !currentUser && router.isReady) {
      router.push(`/?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [authProtected, currentUser, router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Suspense fallback={<Loading />}>
        <main className={`container is-fluid py-5 ${styles.main}`}>
          {loading ? <Loading /> : children}
        </main>
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div className="columns is-centered is-mobile">
      <div className="column is-one-third-tablet is-three-fifths-mobile pt-6 mt-6 is-relative">
        <span
          className="center-absolute position-absolute has-text-grey"
          style={{ bottom: "4px", fontSize: "10px" }}
        >
          L O A D I N G
        </span>
        <progress className="progress is-small is-primary mt-6" max="100">
          15%
        </progress>
      </div>
    </div>
  );
}
