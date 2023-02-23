import { useEffect } from "react";
import Head from "next/head";
import Header from "./header";

export default function Layout({ children, title, description }) {
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
