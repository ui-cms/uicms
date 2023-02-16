import styles from "@/styles/Home.module.css";
import { Page } from "@/components/layout";
import SigninWithGitHubButton from "@/components/signinWithGitHubButton";

export default function Home() {
  return (
    <Page>
      <h1>Home</h1>
      Default repository:
      {/* <SigninWithGitHubButton /> */}
      <h1>Other repositories(hidden)</h1>
    </Page>
  );
}
