import { useRouter } from "next/router";
import Page from "@/components/page";
import { useEffect, useState } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { UICMS_CONFIGS } from "@/helpers/constants";
import { areSame, displayError } from "@/helpers/utilities";
import Tooltip from "@/components/tooltip";
import Icon from "@mdi/react";
import { mdiHelpCircleOutline } from "@mdi/js";
import { RepoConfigFile, RepoConfigData } from "@/helpers/models";

export default function RepoConfiguration() {
  const router = useRouter();
  const repoId = Number(router.query.repo);
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [configData, setConfigData] = useState(null); // local one
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // Load the repo from state management
  useEffect(() => {
    if (repoId && state.repos.length) {
      const _repo = state.repos.find((r) => r.id === repoId);
      if (_repo) {
        setRepo(_repo);
        setConfigData(_repo.config.data);
        setLoading(false);
      } else {
        router.push("/404");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoId, state.repos]); // only trigger when repoId or repos changes

  const save = async () => {
    if (
      areSame(repo.config.data, configData, "No change has been made!") ||
      !isValid() ||
      !confirm("Are you sure ?")
    )
      return;

    try {
      setLoading(true);
      await githubApi.rest.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.name,
        path: UICMS_CONFIGS.fileName,
        message: `uicms config file ${repo.config.sha ? "updated" : "created"}`,
        content: window.btoa(JSON.stringify(configData)), // base64 encode
        sha: repo.config.sha,
      });
      dispatchAction.updateRepo({
        ...repo,
        config: new RepoConfigFile(),
      }); // reset config, so that it will be fetched again in sidebar as sha has been changed (needs to be updated)
      setEditMode(false);
    } catch (e) {
      displayError("Error saving config file!", e);
    } finally {
      setLoading(false);
    }
  };

  // max lengths are checked (prevented) in input level
  function isValid() {
    const errors = [];
    if (configData.websiteName?.length < 3)
      errors.push("Website name is too short!");
    if (configData.collectionsDirectory?.length < 1)
      errors.push("Collections directory is too short!"); // at least a single slash char

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  }

  function onChange(e) {
    const { name, value } = e;
    setConfigData({ ...configData, [name]: value });
  }

  function cancel() {
    setConfigData(repo.config.data);
    setEditMode(false);
  }

  function initConfig() {
    setConfigData(new RepoConfigData());
    setEditMode(true);
  }

  return (
    <Page
      title="Repo configuration"
      loading={loading}
      heading={{
        title: repo?.name,
        subtitle: editMode ? "Editing configuration" : "Configuration",
        buttons: configData ? (
          editMode ? (
            <>
              <Button size="sm" onClick={cancel}>
                Cancel
              </Button>
              <Button type="primary" size="sm" className="ml-2" onClick={save}>
                Save
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
          )
        ) : (
          <Button type="primary" size="sm" onClick={initConfig}>
            Configure
          </Button>
        ),
      }}
    >
      {configData ? (
        <fieldset disabled={!editMode} className="w-50 w-100-sm">
          <TextInputWithLabel
            name="websiteName"
            value={configData.websiteName}
            onChange={onChange}
            max={30}
            label="Website name"
            placeholder="Bob's personal blog"
            help="Just a name to identify for yourself."
            required={true}
            className="mb-5"
          />
          <TextInputWithLabel
            name="collectionsDirectory"
            value={configData.collectionsDirectory}
            onChange={onChange}
            regex={/[^a-zA-Z0-9_/]+/g} // only English letters, numbers, underscore, slash allowed
            label="Collections directory"
            help={
              <span>
                The git directory where you would like collection items (
                <em>.mdx</em> files) to be stored. Directory can consist of
                (English) letters, numbers, underscore and slash sign.
              </span>
            }
            placeholder="_contents/collections"
            required={true}
            className="mb-5"
          />
          <TextInputWithLabel
            name="assetsDirectory"
            value={configData.assetsDirectory}
            onChange={onChange}
            regex={/[^a-zA-Z0-9_/]+/g} // only English letters, numbers, underscore, slash allowed
            label="Assets directory"
            help="The git directory where you would like static asset files (like images) to be stored. Directory can consist of (English) letters, numbers, underscore and slash sign."
            placeholder="_contents/assets"
            className="mb-5"
          />
          <TextInputWithLabel
            name="websiteUrl"
            value={configData.websiteUrl}
            onChange={onChange}
            label="Website URL"
            placeholder="https://mycoolblog.com"
            className="mb-5"
          />
        </fieldset>
      ) : (
        <IncompatibleRepo initConfig={initConfig} />
      )}

      <br />
      <br />
      {repo?.pushed_at && (
        <small className="text-dark mb-2 d-block">
          The last push (update) to this repo was made on{" "}
          {new Date(repo.pushed_at).toLocaleString()}.
        </small>
      )}
    </Page>
  );
}

function IncompatibleRepo() {
  return (
    <div>
      <h3 className="mb-3">Incompatible repo!</h3>
      <p className="mt-5">
        This repo is missing <code>{UICMS_CONFIGS.fileName}</code> file in the
        root directory. That means this repo hasn&apos;t been configured to work
        with UICMS.
        <br />
        <br />
        Click the configure button above if you wish to set UICMS up in this
        repo.
      </p>
    </div>
  );
}

export function TextInputWithLabel({
  name,
  value,
  label,
  placeholder,
  onChange,
  required,
  help,
  className = "",
  disabled = false,
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <div className="d-flex justify-content-space-between">
          <label className="fs-medium mb-1">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
          {help && (
            <Tooltip content={help} className="text-dark">
              <Icon path={mdiHelpCircleOutline} size={0.7} className="mr-1" />
            </Tooltip>
          )}
        </div>
      )}
      <TextInput
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-100"
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}
