/**
 * Once user signs in, GitHub will redirect to callback url with "code" parameter.
 * That code will be passed to our api (api/auth) which will get an auth token from GitHub's API.
 * That token will be used to authenticate user to GitHub's API.
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { displayError } from "@/helpers/utilities";

/**
 * Do not have more than one instance of this component at the same page
 */
export default function SigninWithGitHubButton({ setToken }) {
  const [loading, setLoading] = useState(false); // null = has errors
  const router = useRouter();
  const { code } = router.query;

  // After GitHub sign in button clicked, redirected back with code. Use code to fetch auth token from GitHub Api.
  useEffect(() => {
    if (code && loading === false) {
      (async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/auth?code=${code}`);
          const data = await res.json();
          if (!data.error) {
            setToken(data.access_token);
          } else {
            displayError("Error fetching auth token from GitHub!", data.error);
            setLoading(null);
          }
        } catch (e) {
          displayError("Error signing in to GitHub!", e);
          setLoading(null);
        }
      })();
    }
  }, [code, loading, setToken]);

  return (
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`}
      className={`button ${loading ? "loading" : ""} `}
    >
      <span className="">
        G
      </span>
      <span className="">
        {loading
          ? "Loading"
          : loading === null
          ? "Try again"
          : "Sign in with GitHub"}
      </span>
    </Link>
  );
}
