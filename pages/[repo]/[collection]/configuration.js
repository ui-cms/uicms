import { useRouter } from "next/router";
import Page from "@/components/page";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { TextInputWithLabel } from "../configuration";
import { Select } from "@/components/form";
import { UICMS_CONFIGS } from "@/helpers/constants";
import Icon from "@mdi/react";
import { mdiClose, mdiHelpCircleOutline, mdiPlus } from "@mdi/js";
import Tooltip from "@/components/tooltip";

export default function CollectionConfiguration() {
  const router = useRouter();
  const repoId = router.query.repo;
  const collectionId = router.query.collection;
  const isNew = collectionId?.toLowerCase() === "new"; // when creating new collection. url path: /repoId/new/configuration
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(isNew);
  const [repo, setRepo] = useState(null);
  const [collection, setCollection] = useState(null);
  const [configData, setConfigData] = useState(null); // local one
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // Load the repo that owns this collection from state management
  useEffect(() => {
    if (repoId && state.repos.length) {
      const _repo = state.repos.find((r) => r.id === Number(repoId));
      if (_repo && collectionId) {
        if (_repo.config.data) {
          const _collection = isNew
            ? {}
            : _repo.config.data.collections.find((c) => c.id === collectionId);
          if (_collection) {
            setRepo(_repo);
            setCollection(_collection);
            setConfigData(_collection);
            setLoading(false);
          } else {
            router.push("/404");
          }
        }
      } else {
        router.push("/404");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId, state.repos]); // only trigger when collection or repos changes

  const save = async () => {
    confirm("Are you sure");
  };

  function onChange(e) {
    let { name, value } = e;
    if (name === "item.name") {
      const _configData = { ...configData };
      _configData.item = { ..._configData.item, name: value };
      setConfigData(_configData);
    } else {
      setConfigData({ ...configData, [name]: value });
    }
  }

  function cancel() {
    setConfigData(collection);
    setEditMode(false);
  }

  function hasChanges() {
    return JSON.stringify(collection) !== JSON.stringify(configData);
  }

  function initConfig() {
    // setConfigData({ ...UICMS_CONFIG_TEMPLATE });
    setEditMode(true);
  }

  return (
    <Page
      title={isNew ? "New collection" : "Collection configuration"}
      loading={loading}
      heading={{
        title: isNew ? "New collection" : collection?.name,
        subtitle:
          !isNew && `Configuration (${editMode ? "edit" : "view"} mode)`,
        extra: editMode ? (
          <>
            {!isNew && <Button onClick={cancel}>Cancel</Button>}
            <Button
              type="primary"
              className="ml-2"
              onClick={save}
              disabled={!hasChanges()}
            >
              Save
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)}>Edit</Button>
        ),
      }}
    >
      {configData && (
        <fieldset disabled={!editMode} className="w-50 w-100-sm">
          <TextInputWithLabel
            name="name"
            value={configData.name}
            onChange={onChange}
            label="Collection name"
            placeholder="Blog"
            help="The name of the collection. Usually in plural."
            required={true}
          />
          <TextInputWithLabel
            name="path"
            value={configData.path}
            onChange={onChange}
            label="Path"
            placeholder="blog"
            help="Thic collection path will be contatenated to repo's collection directory and that is where items of this collection will be saved as files."
            required={true}
          />
          <TextInputWithLabel
            name="item.name"
            value={configData.item.name}
            onChange={onChange}
            label="Item name"
            placeholder="Article"
            help="The name of a single item of the collection."
            required={true}
          />

          <details open>
            <summary className="border-bottom pb-2 my-6">
              Item properties
              <Tooltip
                content={
                  <>
                    Item properties are fields of a collection item. They have
                    to have a name and type. A property&apos;s type defines what
                    kind of data it will hold. Its name is for your reference.
                    <br />
                    <br />
                    The (only) property with type <em>richText</em> is used to
                    compose a collection item&apos;s body. Properties with other
                    types are used as meta data.
                    <br />
                    <br />
                    Some of the properties are built-in as default and can not
                    be removed.
                  </>
                }
                className="text-dark ml-3 position-absolute"
              >
                <Icon path={mdiHelpCircleOutline} size={0.7} />
              </Tooltip>
            </summary>

            <ItemProperty />

            <Button onClick={() => {}} type="primaryLight">
              <Icon path={mdiPlus} size={0.75} className="mr-1" />
              New item property
            </Button>
          </details>
        </fieldset>
      )}
    </Page>
  );
}

function ItemProperty({}) {
  function onChange({ name, value }) {}

  return (
    <div className="d-flex">
      <div className="mr-4">
        <label className="d-block fs-medium">
          Type
          {<span className="text-danger ml-1">*</span>}
        </label>
        <Select value={null} onChange={onChange} name="type" className="my-1">
          <option value={null}></option>
          {Object.entries(UICMS_CONFIGS.collectionItemPropertyTypes).map(
            ([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            )
          )}
        </Select>
      </div>
      <div className="w-100 mr-1">
        <TextInputWithLabel
          name="item.name"
          value={null}
          onChange={onChange}
          label="Property name"
          placeholder="Topics"
          required={true}
        />
      </div>
      <div className="d-flex align-items-center ml-1">
        <Button
          onClick={() => {}}
          title="Remove"
          className="bg-transparent p-0 pb-1 text-dark"
        >
          <Icon path={mdiClose} size={0.8} />
        </Button>
      </div>
    </div>
  );
}
