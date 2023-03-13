import Head from "next/head";
import { Inter } from "@next/font/google";
import SideBar from "../sideBar.js";
import styles from "@/styles/Layout.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f0f4f8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className} ${styles.layout}`}>
        <SideBar />
        {children}
      </main>
    </>
  );
}
