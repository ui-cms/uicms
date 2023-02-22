import Page from "@/components/layout/page";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Script from "next/script";

export default function Editor() {
  const { state } = useStateManagement();
  return (
    <Page title="Editor" description="Editor page description">
      <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" />

      {state.currentUser && (
        <pre>{JSON.stringify(state.currentUser, null, 4)}</pre>
      )}
    </Page>
  );
}
