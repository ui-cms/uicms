import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import { IRON_SESSION_OPTIONS } from "@/helpers/constants";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Page from "@/components/layout/page";
import styles from "@/styles/Home.module.scss";
import SigninWithGitHubButton from "@/components/layout/signinWithGitHubButton";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";

/**
 * Using server side props checks if there is any cached auth token and will be set in state management if found
 */
export default function Home({ token }) {
  const router = useRouter();
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { currentUser, authToken } = state;

  // If any auth token passed as props, then set in state management
  useEffect(() => {
    if (!authToken && token) {
      dispatchAction.setAuthToken(token); // see signinWithGitHubButton.js for details on fetching authenticated user's details
    }
  }, [authToken, dispatchAction, token]);

  // If auth token in state management, then fetch current user
  useEffect(() => {
    if (authToken && !currentUser) {
      (async () => {
        try {
          const res = await githubApi.rest.users.getAuthenticated();
          dispatchAction.setCurrentUser(res.data);
        } catch (e) {
          displayError("Error fetching authenticated user!", e);
          setLoading(false);
        }
      })();
    }
  }, [authToken, currentUser, dispatchAction, githubApi.rest.users]);

  // Redirect to previous page or repos page when authorized user
  useEffect(() => {
    if (currentUser) {
      const redirectTo = router.query.redirect || "/repos"; // see pages.js for redirection
      router.push(redirectTo);
    }
  }, [currentUser, router]);

  return (
    <Page
      authProtected={false}
      absolute={true}
      loading={!!authToken || !!token}
    >
      <div>
        <h1>UI CMS</h1>
        <SigninWithGitHubButton
          setToken={(t) => dispatchAction.setAuthToken(t)}
        />
      </div>
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
