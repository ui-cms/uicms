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
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

const STATUS = {
  notStarted: "notStarted",
  loading: "loading",
  fail: "fail",
  success: "success",
};

/**
 * Do not have more than one instance of this component at the same page
 */
export default function SigninWithGitHubButton({
  className,
  boldText = false,
}) {
  const { query } = useRouter();
  const { code } = query;
  const [status, setStatus] = useState(STATUS.notStarted);
  const { state, dispatchAction } = useStateManagement();
  const githubApi = useGitHubApi();

  useEffect(() => {
    if (code && !state.authToken && status === STATUS.notStarted) {
      (async () => {
        setStatus(STATUS.loading);
        try {
          const res = await fetch(`/api/auth?code=${code}`);
          const data = await res.json();

          if (data.error) {
            setStatus(STATUS.fail);
            displayError("Error signing in to GitHub!", data.error);
          } else {
            dispatchAction.setAuthToken(data.access_token);
          }
        } catch (error) {
          setStatus(STATUS.fail);
          displayError(error);
        }
      })();
    }
  }, [code, dispatchAction, state.authToken, status]);

  useEffect(() => {
    if (state.authToken && !state.currentUser && status === STATUS.loading) {
      (async () => {
        try {
          const res = await githubApi.rest.users.getAuthenticated();
          dispatchAction.setCurrentUser(res.data);
          setStatus(STATUS.success);
        } catch (e) {
          setStatus(STATUS.fail);
          displayError("Error fetching authenticated user!", e);
        }
      })();
    }
  }, [dispatchAction, githubApi.rest.users, state.authToken, state.currentUser, status]);

  return (
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`} //&scope=user
      className={`button ${className || ""} ${
        status === STATUS.loading ? "is-loading" : ""
      } ${status === STATUS.fail ? "is-danger" : "is-dark"}`}
    >
      <span className="icon">
        <FaGithub />
      </span>
      <span className={boldText ? "has-text-weight-bold" : ""}>
        {status === STATUS.fail ? "Error, try again" : "Sign in with GitHub"}
      </span>
    </Link>
  );
}
