import styles from "@/styles/Home.module.css";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import Page from "@/components/layout/page";

/**
 * This page is accessible only when not authenticated. Otherwise will redirect to /repos
 */
export default function Home() {
  const { state } = useStateManagement();
  const { currentUser } = state;
  const router = useRouter();

  if (currentUser) {
    router.push("/repos"); // redirect to repos page when authorized user
    return null;
  }
  return (
    <Page authProtected={false}>
      <h1>Home</h1>
    </Page>
  );
}
