import Page from "@/components/page";
import { useCallback, useEffect, useState } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { REGEXES, UICMS_CONFIGS } from "@/helpers/constants";
import { areSame, displayError } from "@/helpers/utilities";
import Tooltip from "@/components/tooltip";
import Icon from "@mdi/react";
import { mdiHelpCircleOutline } from "@mdi/js";
import { RepoConfigFile, RepoConfigData } from "@/helpers/models";
import { Base64 } from "js-base64";

export default function RepoConfiguration() {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState(null); // local one
  const [editMode, setEditMode] = useState(false);
  const { state } = useStateManagement();
  const { selectedRepo } = state;
  const saveRepoConfig = useSaveRepoConfig(setLoading);

  // Load the repo from state management
  useEffect(() => {
    if (selectedRepo) {
      if (selectedRepo.config.data) {
        setConfigData({ ...selectedRepo.config.data });
      } else setConfigData(null);
      setLoading(false);
    }
  }, [selectedRepo]); // only trigger when selected repo changes

  const save = async () => {
    // max lengths are checked (prevented) in input level
    function isValid() {
      const errors = [];
      if (configData.websiteName?.trim().length < 3)
        errors.push("Website name is too short!");

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
      }
      return true;
    }

    if (isValid()) {
      if (await saveRepoConfig(selectedRepo, configData)) {
        setEditMode(false);
      }
    }
  };

  function onChange(e) {
    const { name, value } = e;
    setConfigData({ ...configData, [name]: value });
  }

  function cancel() {
    setConfigData({ ...selectedRepo.config.data });
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
        title: selectedRepo?.name,
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
            regex={REGEXES.EnglishAlphanumeric_Underscore_Slash} // only English letters, numbers, underscore, slash allowed
            label="Collections directory"
            help={
              <span>
                The directory where you would like collection items (
                <em>.mdx</em> files) to be stored. If none given, root folder
                will be used. Directory can consist of (English) letters,
                numbers, underscore and slash sign.
              </span>
            }
            placeholder="_contents/collections"
            className="mb-5"
          />
          <TextInputWithLabel
            name="assetsDirectory"
            value={configData.assetsDirectory}
            onChange={onChange}
            regex={REGEXES.EnglishAlphanumeric_Underscore_Slash} // only English letters, numbers, underscore, slash allowed
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
      {selectedRepo?.pushed_at && (
        <small className="text-dark mb-2 d-block">
          The last push (update) to this repo was made on{" "}
          {new Date(selectedRepo.pushed_at).toLocaleString()}.
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
  regex, // use regex to filter unwanted chars in value. If passing valid chars, make sure to negate regex with ^ symbol. E.g /[^a-zA-Z0-9]+/g will cause all non alphanumeric to be removed
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

/**
 * Saves contents of UICMS config file (json) for a given repo
 */
export function useSaveRepoConfig(setLoading) {
  const githubApi = useGitHubApi();
  const { dispatchAction } = useStateManagement();

  const saveRepoConfig = useCallback(async (repo, configData) => {
    let result = false;
    if (
      areSame(repo.config.data, configData, "No change has been made!") ||
      !confirm(
        "Are you sure ?\n\nBe warned that changes will not be applied to existing collections/items."
      )
    )
      return result;

    try {
      setLoading(true);
      await githubApi.rest.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.name,
        path: UICMS_CONFIGS.fileName,
        message: `uicms config file ${repo.config.sha ? "updated" : "created"}`,
        content: Base64.encode(JSON.stringify(configData)), // built-in js ecoding function (window.btoa) won't work with non-latin chars
        sha: repo.config.sha,
      });

      // reset config, so that it will be fetched again in sidebar as sha has been changed (needs to be updated)
      dispatchAction.updateRepo({
        ...repo,
        config: new RepoConfigFile(),
      });

      result = true;
    } catch (e) {
      displayError("Error saving config file!", e);
    } finally {
      setLoading(false);
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no necessary dependency

  return saveRepoConfig;
}
