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
import {
  mdiCheck,
  mdiClose,
  mdiDeleteOutline,
  mdiHelpCircleOutline,
  mdiPencilOutline,
  mdiPlus,
} from "@mdi/js";
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

  function updateProperty(property) {
    const _configData = { ...configData };
    const properties = _configData.item.properties.map((p) =>
      p.id === property.id ? property : p
    );
    _configData.item = { ..._configData.item, properties };
    setConfigData(_configData);
  }

  function removeProperty(id) {
    const _configData = { ...configData };
    const properties = _configData.item.properties.filter((p) => p.id !== id);
    _configData.item = { ..._configData.item, properties };
    setConfigData(_configData);
  }

  function addProperty() {
    const property = { id: new Date().getTime() };
    const _configData = { ...configData };
    _configData.item = {
      ..._configData.item,
      properties: [..._configData.item.properties, property],
    };
    setConfigData(_configData);
  }

  function cancel() {
    setConfigData(collection);
    setEditMode(false);
  }

  function hasChanges() {
    return JSON.stringify(collection) !== JSON.stringify(configData);
  }

  return (
    <Page
      title={isNew ? "New collection" : "Collection configuration"}
      loading={loading}
      heading={{
        title: isNew ? "New collection" : collection?.name,
        subtitle:
          !isNew && `Configuration (${editMode ? "editing" : "viewing"})`,
        buttons: editMode ? (
          <>
            {!isNew && (
              <Button size="sm" onClick={cancel}>
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              className="ml-2"
              onClick={save}
              disabled={!hasChanges()}
              size="sm"
            >
              Save
            </Button>
          </>
        ) : (
          <Button type="primary" size="sm" onClick={() => setEditMode(true)}>
            Edit
          </Button>
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
            className="mb-5"
          />
          <TextInputWithLabel
            name="path"
            value={configData.path}
            onChange={onChange}
            label="Path"
            placeholder="blog"
            help="Thic collection path will be contatenated to repo's collection directory and that is where items of this collection will be saved as files."
            required={true}
            className="mb-5"
          />
          <TextInputWithLabel
            name="item.name"
            value={configData.item.name}
            onChange={onChange}
            label="Item name"
            placeholder="Article"
            help="The name of a single item of the collection."
            required={true}
            className="mb-5"
          />

          <details open>
            <summary className="border-bottom pb-2 my-6">
              <span className="d-inline-flex align-items-center">
                Item properties
                <Tooltip
                  content={
                    <>
                      Item properties are fields of a collection item. They have
                      to have a name and type. A property&apos;s type defines
                      what kind of data it will hold. Its name is for your
                      reference.
                      <br />
                      <br />
                      The (only) property with type <em>richtext</em> is used to
                      compose a collection item&apos;s body. Properties with
                      other types are used as meta data.
                      <br />
                      <br />
                      Some of the properties are built-in as default and can not
                      be removed.
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

            {configData.item.properties.map((property, index) => (
              <ItemProperty
                key={property.id}
                showLabels={index === 0}
                property={property}
                updateProperty={updateProperty}
                removeProperty={removeProperty}
              />
            ))}

            <Button onClick={addProperty} type="primaryLight" className="mt-3">
              <Icon path={mdiPlus} size={0.75} className="mr-1" />
              New item property
            </Button>
          </details>
        </fieldset>
      )}
    </Page>
  );
}

function ItemProperty({
  property,
  updateProperty,
  removeProperty,
  showLabels,
}) {
  const [prop, setProp] = useState({}); // local
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (property) setProp({ ...property });
  }, [property]);

  function onChange({ name, value }) {
    if (name === "name") {
      value = value.replace(/[^a-zA-Z0-9_]+/g, ""); // only English letter, numbers and underscore allowed

      if (value.length > 30) return; // max name length 30
    }
    setProp({ ...prop, [name]: value });
  }

  function apply() {
    updateProperty({ ...prop });
    setEditing(false);
  }

  function cancel() {
    setProp({ ...property });
    setEditing(false);
  }

  function hasValidChanges() {
    return prop.name && prop.name.length > 2 && prop.type;
  }

  return (
    <div className="d-flex align-items-flex-end mb-2">
      <div>
        {showLabels && (
          <div className="d-flex justify-content-space-between">
            <label className="d-block fs-medium mb-1">
              Type
              {<span className="text-danger ml-1">*</span>}
            </label>
            <Tooltip
              content={
                <>
                  <em>richtext</em> type can only be used once to create one
                  property only which will be called <em>body</em>.
                </>
              }
              className="text-dark"
            >
              <Icon path={mdiHelpCircleOutline} size={0.7} className="mr-1" />
            </Tooltip>
          </div>
        )}
        <Select
          value={prop.type}
          onChange={onChange}
          name="type"
          disabled={!editing}
        >
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
      <div className="w-100 mx-2">
        <TextInputWithLabel
          name="name"
          value={prop.name}
          onChange={onChange}
          label={showLabels && "Property name"}
          placeholder="Topics"
          required={true}
          help="Property name can consist of letters, numbers and underscore sign. You can use property names to access meta data of an item."
          disabled={!editing}
        />
      </div>
      <div className="d-flex align-items-flex-end">
        {editing ? (
          <>
            <Button
              onClick={apply}
              title="Apply changes"
              className="px-1 mr-2"
              type="primary"
              size="sm"
              disabled={!hasValidChanges()}
            >
              <Icon path={mdiCheck} size={0.8} />
            </Button>
            <Button onClick={cancel} title="Cancel" className="px-1" size="sm">
              <Icon path={mdiClose} size={0.8} />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setEditing(true)}
              title="Edit"
              className="px-1 mr-2"
              size="sm"
            >
              <Icon path={mdiPencilOutline} size={0.8} />
            </Button>
            <Button
              onClick={() => removeProperty(property.id)}
              title="Remove"
              className="px-1"
              size="sm"
            >
              <Icon path={mdiDeleteOutline} size={0.8} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
