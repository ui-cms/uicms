import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";
import { useRouter } from "next/router";
import { displayError } from "@/helpers/utilities";

export default function Item() {
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { selectedItem, selectedCollection, selectedRepo } = state;
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null); // {path, sha, content}
  const [assets, setAssets] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!selectedItem) return;

    (async () => {
      try {
        // fetch all files in item folder
        const res = await githubApi.rest.repos.getContent({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path: `${selectedRepo.config.data.collectionsDirectory}/${selectedCollection.path}/${selectedItem}`, // todo slash check
        });

        let contentFilePath;
        const _assets = res.data.reduce((acc, el) => {
          if (el.type === "file") {
            if (el.name === "_.json") {
              contentFilePath = el.path;
            } else {
              acc.push(el.name);
            }
          }
          return acc;
        }, []);
        setAssets(_assets);

        // fetch item content from item's main file
        const res2 = await githubApi.customRest.getFileContentAndSha(
          selectedRepo.owner,
          selectedRepo.name,
          contentFilePath
        );        
        setItem({
          path: contentFilePath,
          sha: res2.sha,
          content: JSON.parse(res2.content),
        });
      } catch (e) {
        displayError("Error fetching item details!", e);
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <Page
      title="Item"
      loading={loading}
      heading={{
        title: item?.content?.title,
        subtitle: editMode ? "Editing item" : "Preview",
        buttons: null,
      }}
    >
      {/* <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" /> */}

      <pre>{selectedItem}</pre>
      <br />
    </Page>
  );
}
