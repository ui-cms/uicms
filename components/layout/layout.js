import { useEffect } from "react";
import Head from "next/head";
import Header from "./header";
import useAuth from "@/hooks/useAuth";

export default function Layout({ children, title, description }) {
  const { tryCachedAuthToken } = useAuth();

  // Check if there is any auth token cached and set in state management if found
  useEffect(() => {
    (async () => tryCachedAuthToken())();
  }, [tryCachedAuthToken]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={title} description={description} />
      {children}
    </>
  );
}
