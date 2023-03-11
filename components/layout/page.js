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
        <main>{loading ? <Loading /> : children}</main>
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div>Loading...</div>
  );
}
