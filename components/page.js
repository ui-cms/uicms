import Head from "next/head";
import styles from "@/styles/Layout.module.scss";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function Page({
  children,
  authProtected = true,
  title = "UI CMS",
  description = "Simple yet powerfull gitbased CMS",
}) {
  const { state } = useStateManagement();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <main
        className={`container is-fluid py-5 has-background-light ${styles.main}`}
      >
        {authProtected && !state.currentUser ? (
          <section className="hero is-halfheight">
            <div className="hero-body">
              <div className="">
                <p className="title">Access denied.</p>
                <p className="subtitle">
                  This page is only accessible when you are authenticated.
                  Please, sign in using your GitHub account.
                </p>
              </div>
            </div>
          </section>
        ) : (
          children
        )}
      </main>
    </>
  );
}
