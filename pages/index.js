import styles from "@/styles/Home.module.css";
import { Page } from "@/components/layout";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function Home() {
  const { state } = useStateManagement();
  return (
    <Page>
      <h1>Home</h1>
      Default repository:
      <h1>Other repositories(hidden)</h1>
      {state.currentUser && (
        <pre>{JSON.stringify(state.currentUser, null, 4)}</pre>
      )}
    </Page>
  );
}
