import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";
import { useRouter } from "next/router";

export default function Item() {
  const router = useRouter();
  const isNew = Number(router.query.item) === 0; // when creating new item. url path: /repoId/collection/0
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { selectedItem } = state;
  const { itemData, setItemData } = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setLoading(false);
    }
  }, []);

  return (
    <Page
      title={isNew ? "New item" : "Item"}
      loading={loading}
      heading={{
        title: isNew ? "New item" : "todo: itemData.title",
        subtitle: editMode ? "Editing item" : "Preview",
        buttons: null,
      }}
    >
      <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" />

      <pre>{selectedItem}</pre>
      <br />
    </Page>
  );
}
