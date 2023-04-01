import Head from "next/head";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Page.module.scss";
import Loader from "@/components/loader";

export default function Page({
  children,
  authProtected = true,
  loading = false,
  title = "UI CMS",
  description = "Simple yet powerful gitbased CMS",
  absolute = false, // absolute full page (layout) that is covering full screen
  heading, // {title: "", subtitle: "", extra: jsx}
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
      <Suspense fallback={<Loader />}>
        <article className={absolute ? styles.absolute : styles.content}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {!absolute && heading && (
                <Heading title={heading.title} subtitle={heading.subtitle}>
                  {heading.extra}
                </Heading>
              )}
              <section>{children}</section>
            </>
          )}
        </article>
      </Suspense>
    </>
  );
}

function Heading({ title, subtitle, children }) {
  return (
    <nav className={styles.heading}>
      <h2>{title}</h2>
      <small>{subtitle}</small>
      <menu className={styles.extra}>{children}</menu>
    </nav>
  );
}
