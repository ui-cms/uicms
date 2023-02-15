import styles from "@/styles/Home.module.css";
import { Page } from "@/components/layout";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const GITHUB_CLIENT_ID = "c2aee16cc872240e19c4";
const GITHUB_REDIRECT_URI = "http://localhost:3000/auth";

export default function Home() {
  return (
    <Page>
      <h1>Home</h1>
      Default repository:
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURI(
          GITHUB_REDIRECT_URI
        )}`}
        className="button is-medium is-dark"
      >
        <span className="icon">
          <FaGithub />
        </span>
        <span>MyNewsWebsite</span>
      </Link>
      <h1>Other repositories(hidden)</h1>
    </Page>
  );
}
