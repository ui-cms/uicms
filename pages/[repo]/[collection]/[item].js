import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";

export default function Item() {
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { selectedItem } = state;

  return (
    <Page title="Item">
      <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" />

      <pre>{selectedItem}</pre>
      <br />
    </Page>
  );
}
