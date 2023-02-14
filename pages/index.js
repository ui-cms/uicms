import styles from "@/styles/Home.module.css";
import { Page } from "@/components/layout";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <Page>
      <h1>Home</h1>
      Default repository:
      <button className="button is-medium is-dark">
        <span className="icon">
          <FaGithub />
        </span>
        <span>MyNewsWebsite</span>
      </button>
      <h1>Other repositories(hidden)</h1>
    </Page>
  );
}
