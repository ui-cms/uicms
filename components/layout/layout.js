import Head from "next/head";
import { Inter } from "@next/font/google";
import SideBar from "../SideBar";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <SideBar />
        {children}
      </main>
    </>
  );
}
