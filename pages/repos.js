import Page from "@/components/page";
import useStateManagement from "@/services/stateManagement/stateManagement";

export default function Repos() {
  const { state } = useStateManagement();
  return (
    <Page>
      <h1>Repos</h1>
      Default repository:
      <h1>Other repositories(hidden)</h1>
      {state.currentUser && (
        <pre>{JSON.stringify(state.currentUser, null, 4)}</pre>
      )}
    </Page>
  );
}
