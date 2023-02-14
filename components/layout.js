import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Layout.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children, title, description }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={title} description={description} />
      <main className={inter.className + " " + styles.main}>{children}</main>
    </>
  );
}

function Header() {
  return (
    <header className={inter.className}>
      <Link href="/">
        <Image
          className={styles.logo}
          src="/logo.svg"
          alt="UI CMS logo"
          width={180}
          height={36}
          priority
        />
      </Link>
      <Link href="/">Home</Link>
      <Link href="/editor">Editor</Link>
    </header>
  );
}

export function Page({
  children,
  title = "UI CMS",
  description = "Simple yet powerfull gitbased CMS",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      {children}
    </>
  );
}
