import Head from "next/head";
import SideBar from "../SideBar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SideBar />
        {children}
      </main>
    </>
  );
}
