// Once user signs in, GitHub will redirect to call back url with code parameter, which then will be used to fetch auth token.
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function SigninWithGitHubButton({
  className,
  boldText = false,
}) {
  const { query } = useRouter();
  const code = query.code;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(code && code.length > 0);   // && !isAuthenticated

  useEffect(() => {
    // if (code && !isAuthenticated) {
    if (code) {
      fetch(`/api/auth?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            // persist auth token
            // do octakit call here to fetch user
          }
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [code]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      className={`button ${className || ""}  ${
        error ? "is-danger" : "is-dark"
      } ${loading ? "is-loading" : ""}`}
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
