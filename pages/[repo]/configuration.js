import { useRouter } from "next/router";
import Page from "@/components/page";
import { useEffect, useState } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import {
  UICMS_CONFIGS,
  UICMS_CONFIG_STARTER_TEMPLATE,
} from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";

export default function RepoConfiguration() {
  const router = useRouter();
  const repoId = router.query.repo;
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [configData, setConfigData] = useState(null); // local one
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // Load the repo from state management
  useEffect(() => {
    if (repoId && state.repos.length) {
      const _repo = state.repos.find((r) => r.id === Number(repoId));
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
    if (confirm("Are you sure ? ")) {
      try {
        setLoading(true);
        await githubApi.rest.repos.createOrUpdateFileContents({
          owner: repo.owner,
          repo: repo.name,
          path: UICMS_CONFIGS.fileName,
          message: `uicms config file ${
            repo.config.sha ? "updated" : "created"
          }`,
          content: window.btoa(JSON.stringify(configData)), // base64 encode
          sha: repo.config.sha,
        });
        dispatchAction.updateRepo({
          ...repo,
          config: { sha: null, data: null },
        }); // reset config, so that it will be fetched again in sidebar as sha has been changed (needs to be updated)
        setEditMode(false);
      } catch (e) {
        displayError("Error saving config file!", e);
      } finally {
        setLoading(false);
      }
    }
  };

  function onChange(e) {
    const { name, value } = e;
    setConfigData({ ...configData, [name]: value });
  }

  function cancel() {
    setConfigData(repo.config.data);
    setEditMode(false);
  }

  function hasChanges() {
    return JSON.stringify(repo.config.data) !== JSON.stringify(configData);
  }

  function initConfig() {
    setConfigData({ ...UICMS_CONFIG_STARTER_TEMPLATE });
    setEditMode(true);
  }

  return (
    <Page
      title="Repo configuration"
      loading={loading}
      heading={{
        title: repo?.name,
        subtitle: "Configuration",
        extra: configData ? (
          editMode ? (
            <>
              <Button onClick={cancel}>Cancel</Button>
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
          )
        ) : (
          <Button type="primaryLight" onClick={initConfig}>
            Configure
          </Button>
        ),
      }}
    >
      {configData ? (
        <fieldset disabled={!editMode}>
          <TextInputWithLabel
            name="websiteName"
            value={configData.websiteName}
            onChange={onChange}
            label="Website name"
            placeholder="Bob's personal blog"
            help="Just a name to identify for yourself."
            required={true}
          />
          <TextInputWithLabel
            name="websiteUrl"
            value={configData.websiteUrl}
            onChange={onChange}
            label="Website URL"
            placeholder="https://mycoolblog.com"
          />
          <TextInputWithLabel
            name="assetsDirectory"
            value={configData.assetsDirectory}
            onChange={onChange}
            label="Assets directory"
            help="The git directory where you would like static asset files (like images) to be stored."
            placeholder="_contents/assets"
            required={true}
          />
          <TextInputWithLabel
            name="collectionsDirectory"
            value={configData.collectionsDirectory}
            onChange={onChange}
            label="Collections directory"
            help={
              <span>
                The git directory where you would like collection items (
                <code>.md</code> files) to be stored.
              </span>
            }
            placeholder="_contents/collections"
            required={true}
          />
        </fieldset>
      ) : (
        <NotFound initConfig={initConfig} />
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

function NotFound() {
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

function TextInputWithLabel({
  name,
  value,
  label,
  placeholder,
  onChange,
  required,
  help,
}) {
  return (
    <div className="mb-5">
      {label && (
        <label className="fs-medium">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <TextInput
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="d-block w-50 w-100-sm my-1"
      />
      {help && <small>{help}</small>}
    </div>
  );
}
