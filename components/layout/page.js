import Head from "next/head";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/router";

export default function Page({
  children,
  authProtected = true,
  loading = false,
  title = "UI CMS",
  description = "Simple yet powerful gitbased CMS",
  absolute = false, // absolute full page (layout) that is covering full screen
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
        <article
          className={
            absolute
              ? "position-absolute w-100 h-100 bg-light d-flex align-items-center justify-content-center text-center"
              : ""
          }
        >
          {loading ? <Loading /> : children}
        </article>
      </Suspense>
    </>
  );
}

export function Loading() {
  return <div>Loading...</div>;
}
