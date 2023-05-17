import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useCallback, useEffect, useState } from "react";
import Page from "@/components/page";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
import { TextInputWithLabel } from "pages/[repo]/configuration";
import { REGEXES, UICMS_CONFIGS } from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";

export default function Item() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { selectedRepo, selectedCollection, currentUser } = state;
  const saveItem = useSaveItem(setLoading);

  async function save() {
    if (title.trim().length < 3) {
      alert("Title is too short!");
      return false;
    }

    const today = new Date();
    const id = today.getTime();
    const slug = title
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_")
      .replace(REGEXES.GlobalAlphanumeric_Underscore, "") // alphanumeric (any language) and underscore
      .substring(0, 29); // take no more than 30 chars

    const itemName = `${id}_${slug}`;
    const filePath = `${selectedRepo.config.data.collectionsDirectory}/${selectedCollection.path}/${itemName}/_.json`;

    const itemData = {
      title,
      author: `${currentUser.name} (${currentUser.login})`,
      draft: true,
      date: `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()} ${today.getUTCHours()}:${today.getUTCMinutes()}`,
      body: null,
    };

    if (
      await saveItem(
        selectedRepo.owner,
        selectedRepo.name,
        filePath,
        itemName,
        itemData
      )
    ) {
      router.push(`/${selectedRepo.id}/${selectedCollection.id}/${id}`);
    }
  }

  return (
    <Page
      title="New item"
      loading={loading}
      heading={{
        title: "New item",
        buttons: (
          <Button type="primary" size="sm" onClick={save}>
            Next
          </Button>
        ),
      }}
    >
      <fieldset className="w-50 w-100-sm">
        <TextInputWithLabel
          name="name"
          value={title}
          onChange={({ value }) => setTitle(value)}
          label="Title"
          placeholder="A cool item title"
          required={true}
        />
      </fieldset>
    </Page>
  );
}

/**
 * Saves contents of item file
 */
export function useSaveItem(setLoading) {
  const githubApi = useGitHubApi();

  const saveItem = useCallback(
    async (repoOwner, repoName, filePath, itemName, itemData, sha = null) => {
      let result = false;
      if (!confirm("Are you sure ?")) return result;

      try {
        setLoading(true);
        await githubApi.rest.repos.createOrUpdateFileContents({
          owner: repoOwner,
          repo: repoName,
          path: filePath,
          message: `${itemName} ${sha ? "updated" : "created"}`,
          content: window.btoa(JSON.stringify(itemData)), // base64 encode
          sha: sha,
        });

        // refetch locally or refresh page

        // dispatchAction.updateRepo({
        //   ...repo,
        //   config: new RepoConfigFile(),
        // }); // reset config, so that it will be fetched again in sidebar as sha has been changed (needs to be updated)
        result = true;
      } catch (e) {
        displayError("Error saving item!", e);
      } finally {
        setLoading(false);
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // no necessary dependency
  );

  return saveItem;
}
