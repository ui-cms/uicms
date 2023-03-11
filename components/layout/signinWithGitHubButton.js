/**
 * Once user signs in, GitHub will redirect to callback url with "code" parameter.
 * That code will be passed to our api (api/auth) which will get an auth token from GitHub's API.
 * That token will be used to authenticate user to GitHub's API.
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { displayError } from "@/helpers/utilities";

/**
 * Do not have more than one instance of this component at the same page
 */
export default function SigninWithGitHubButton({
  setToken,
  setLoading,
  hidden,
}) {
  const started = useRef(false);
  const router = useRouter();
  const { code } = router.query;

  // After GitHub sign in button clicked, redirected back with code. Use code to fetch auth token from GitHub Api.
  useEffect(() => {
    if (code && !started.current) {
      (async () => {
        started.current = true;
        setLoading(true);
        try {
          const res = await fetch(`/api/auth?code=${code}`);
          const data = await res.json();
          if (!data.error) {
            setToken(data.access_token);
          } else {
            displayError("Error fetching auth token from GitHub!", data.error);
            setLoading(false);
          }
        } catch (e) {
          displayError("Error signing in to GitHub!", e);
          setLoading(false);
        }
      })();
    }
  }, [code, setToken, setLoading]);

  return (
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`}
      className={`button ${hidden ? "d-none" : ""} `}
    >
      <span className="">
        <FaGithub />
      </span>
      <span className="">Sign in with GitHub</span>
    </Link>
  );
}
