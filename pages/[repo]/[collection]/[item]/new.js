import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useCallback, useEffect, useState } from "react";
import Page from "@/components/page";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
import { TextInputWithLabel } from "pages/[repo]/configuration";
import { REGEXES, UICMS_CONFIGS } from "@/helpers/constants";
import { displayError, isNullOrEmpty } from "@/helpers/utilities";
import { Base64 } from "js-base64";

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

    // see default props
    const itemData = {
      title,
      author: `${currentUser.name} (${currentUser.login})`,
      draft: true,
      date: `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()} ${today.getUTCHours()}:${today.getUTCMinutes()}`,
    };

    if (
      await saveItem(
        selectedRepo,
        selectedCollection.id,
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
      <fieldset className="w-100">
        <TextInputWithLabel
          value={title}
          onChange={({ value }) => setTitle(value)}
          label="Title"
          placeholder="A cool item title"
          required={true}
          max={50}
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
  const { state, dispatchAction } = useStateManagement();

  const saveItem = useCallback(
    async (repo, collectionId, filePath, itemName, itemData, sha = null) => {
      let result = false;
      if (!confirm("Are you sure ?")) return result;

      try {
        setLoading(true);
        await githubApi.rest.repos.createOrUpdateFileContents({
          owner: repo.owner,
          repo: repo.name,
          path: filePath,
          message: `${itemName} ${sha ? "updated" : "created"}`,
          content: Base64.encode(JSON.stringify(itemData)), // built-in js ecoding function (window.btoa) won't work with non-latin chars
          sha: sha,
        });

        const _items = isNullOrEmpty(state.items[repo.id]?.[collectionId])
          ? [itemName]  // first ever item
          : [...state.items[repo.id][collectionId], itemName];
        dispatchAction.setItems(repo.id, collectionId, _items); // insert into items list

        result = true;
      } catch (e) {
        displayError("Error saving item!", e);
      } finally {
        setLoading(false);
      }
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.items] // no necessary dependency
  );

  return saveItem;
}
