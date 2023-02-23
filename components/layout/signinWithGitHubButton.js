/**
 * Once user signs in, GitHub will redirect to callback url with "code" parameter.
 * That code will be passed to our api (api/auth) which will get an auth token from GitHub's API.
 * That token will be used to authenticate user to GitHub's API.
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 */

import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";

const STATUS = {
  notStarted: "notStarted",
  loading: "loading",
  fail: "fail",
  done: "done",
};

/**
 * Do not have more than one instance of this component at the same page
 */
export default function SigninWithGitHubButton({
  className,
  boldText = false,
}) {
  const loading = useRef(false);
  const [error, setError] = useState(false);
  const githubApi = useGitHubApi();
  const { query } = useRouter();
  const { code } = query;
  const { state, dispatchAction } = useStateManagement();
  const { authToken } = state;

  // After GitHub sign in button clicked, redirected back with code. Use code to fetch auth token from GitHub Api.
  useEffect(() => {
    if (code && !authToken && !loading.current) {
      (async () => {
        loading.current = true;
        try {
          const res = await fetch(`/api/auth?code=${code}`);
          const data = await res.json();

          if (data.error) {
            setError(true);
            displayError("Error signing in to GitHub!", data.error);
          } else {
            dispatchAction.setAuthToken(data.access_token);
          }
        } catch (e) {
          setError(true);
          displayError("Error fetching auth token from GitHub!", e);
        }
      })();
    }
  }, [authToken, code, dispatchAction]);

  // If there is a token (fetched from GitHub Api), use it to fetch current user.
  useEffect(() => {
    if (authToken && !state.currentUser && (loading.current || !error)) {
      (async () => {
        try {
          const res = await githubApi.rest.users.getAuthenticated();
          dispatchAction.setCurrentUser(res.data);
        } catch (e) {
          setError(true);
          displayError("Error fetching authenticated user!", e);
        }
      })();
    }
  }, [
    authToken,
    dispatchAction,
    error,
    githubApi.rest.users,
    state.currentUser,
  ]);

  return (
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`} //&scope=user
      className={`button ${className || ""} ${
        loading.current ? "is-loading" : ""
      } ${error ? "is-danger" : "is-dark"}`}
    >
      <span className="icon">
        <FaGithub />
      </span>
      <span className={boldText ? "has-text-weight-bold" : ""}>
        {error ? "Error, try again" : "Sign in with GitHub"}
      </span>
    </Link>
  );
}
