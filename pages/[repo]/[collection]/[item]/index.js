import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useCallback, useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";
import { useRouter } from "next/router";
import { displayError } from "@/helpers/utilities";
import Tooltip from "@/components/tooltip";
import Icon from "@mdi/react";
import { mdiHelpCircleOutline } from "@mdi/js";
import { TextInputWithLabel } from "pages/[repo]/configuration";
import { Button } from "@/components/button";
import { UICMS_CONFIGS } from "@/helpers/constants";
import styles from "@/styles/Item.module.scss";

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

  const getCustomProperties = useCallback(
    () =>
      selectedCollection?.item.properties.filter((p) => {
        // filter default properties
        const defaultProp = UICMS_CONFIGS.collectionItemDefaultProperties.find(
          (d) => d.id === p.id
        );
        return !defaultProp;
      }),
    [selectedCollection?.item.properties]
  );

  function onChange({ name, value }) {
    const _content = { ...item.content, [name]: value };
    setItem({ ...item, content: _content });
  }

  function cancel() {
    setEditMode(false);
  }

  const getItemDateInLocal = useCallback(() => {
    if (!item?.content.date) return "";

    const date = new Date(`${item?.content.date} UTC`); // stored date is in UTC. When creating new date object let it create from UTC
    return `${date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}, ${date.toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "numeric",
    })}`;
  }, [item?.content.date]);

  return (
    <Page
      title="Item"
      loading={loading}
      heading={{
        title: item?.content?.title,
        subtitle: editMode ? "Editing item" : "Preview",
        buttons:
          item &&
          (editMode ? (
            <>
              <Button size="sm" onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="primaryLight"
                size="sm"
                className="ml-2"
                title="Save as draft"
              >
                Save
              </Button>
              <Button
                type="primary"
                size="sm"
                className="ml-2"
                title="Save and publish"
              >
                Publish
              </Button>
            </>
          ) : (
            <Button
              type="primaryLight"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )),
      }}
    >
      <div className={styles.details}>
        <TextInputWithLabel
          name="title"
          value={item?.content.title}
          onChange={onChange}
          max={50}
          label="Title"
          placeholder={`${selectedCollection?.item.name} title goes here`}
          className={styles.title}
          disabled={!editMode}
          required={true}
        />
        <div className={styles.authorAndDate}>
          <p>
            By <span>{item?.content.author}</span> on{" "}
            <span>{getItemDateInLocal()}</span>
          </p>
        </div>
      </div>

      <Properties
        properties={getCustomProperties()}
        itemContent={item?.content}
        editMode={editMode}
        onChange={onChange}
      />
      {/* <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" /> */}

      <pre>{selectedItem}</pre>
      <br />
    </Page>
  );
}

function Properties({ properties, itemContent, editMode, onChange }) {
  return (
    <details className={styles.properties}>
      <summary className="border-bottom pb-2 mb-4">
        <span className="d-inline-flex align-items-center">
          Properties
          <Tooltip
            content={
              <>
                Properties are meta data of the item. Some are built-in that
                will be auto-populated. Others that you have defined under
                <em>Collection&apos;s Configuration</em> need to be
                filled/leveraged by you.
              </>
            }
            className="text-dark ml-3"
          >
            <Icon
              path={mdiHelpCircleOutline}
              size={0.7}
              style={{ marginBottom: "-3px" }}
            />
          </Tooltip>
        </span>
      </summary>

      <fieldset>
        {properties.map((prop) => {
          return (
            <TextInputWithLabel
              key={prop.id}
              name={prop.name}
              value={itemContent[prop.name]}
              onChange={onChange}
              max={30}
              label={prop.name}
              placeholder={prop.type}
              className="w-25 mb-5"
              disabled={!editMode}
            />
          );
        })}
      </fieldset>
    </details>
  );
}
