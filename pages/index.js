import { useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import { IRON_SESSION_OPTIONS } from "@/helpers/constants";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Page from "@/components/layout/page";
import styles from "@/styles/Home.module.scss";

/**
 * Using server side props checks if there is any cached auth token and will be set in state managemetn if found
 */
export default function Home({ token }) {
  const { state, dispatchAction } = useStateManagement();
  const { currentUser, authToken } = state;
  const router = useRouter();

  // If any auth token passed as props, then set in state management
  useEffect(() => {
    if (!authToken && token) {
      dispatchAction.setAuthToken(token); // see signinWithGitHubButton.js for details on fetching authenticated user's details
    }
  }, [authToken, dispatchAction, token]);

  // Redirect to previous page or repos page when authorized user
  useEffect(() => {
    if (currentUser) {
      const redirectTo = router.query.redirect || "/repos"; // see pages.js for redirection
      router.push(redirectTo);
    }
  }, [currentUser, router]);

  return (
    <Page authProtected={false}>
      <section className="hero is-medium is-primary box">
        <div className="hero-body">
          <p className="title">Welcome!</p>
          <p className="subtitle">
            Get started to use{" "}
            <Link
              href="https://uicms.app"
              target="_blank"
              className="is-underlined"
            >
              UICMS
            </Link>{" "}
            by signing in to your{" "}
            <Link
              href="https://github.com"
              target="_blank"
              className="is-underlined"
            >
              GitHub
            </Link>{" "}
            account.
          </p>
        </div>
      </section>
    </Page>
  );
}

// Server side check if there is any auth token cached in iron-session and pass as props
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const token = req.session.token?.access_token || null;
    return {
      props: {
        token,
      },
    };
  },
  IRON_SESSION_OPTIONS
);
