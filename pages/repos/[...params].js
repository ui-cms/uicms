import Page from "@/components/layout/page";
import {
  UICMS_CONFIGS,
  UICMS_CONFIG_STARTER_TEMPLATE,
} from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe, FaRegSun, FaRegListAlt } from "react-icons/fa";
import { TextInput } from "@/components/form";
import TitleWithTabs from "@/components/titleWithTabs";

export default function Repo() {
  const { query } = useRouter();
  const [owner, repoName] = query.params ? query.params : [];
  // const [repo, setRepo] = useState(null);
  const [config, setConfig] = useState(null);
  const [sha, setSha] = useState(null); // SHA blob of config file. Use it to update file content.
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  // useEffect(() => {
  //   // optionally finds the repos from state management. If landed directly to this page, this won't work
  //   if (!repo && state.repos.length > 0 && owner && repoName) {
  //     const _repo = state.repos.find(
  //       (r) => r.full_name === `${owner}/${repoName}`
  //     );
  //     if (_repo) {
  //       setRepo(_repo);
  //     }
  //   }
  // }, [owner, repo, repoName, state.repos]);

  const getConfig = useCallback(async () => {
    try {
      const res = await githubApi.customRest.getFileContentAndSha(
        owner,
        repoName,
        UICMS_CONFIGS.fileName
      );
      setSha(res.sha);
      setConfig(JSON.parse(res.content));
    } catch (e) {
      // when 404, no config file, incompatible repo
      if (e.status !== 404) {
        displayError("Error fetching config file!", e);
      }
    } finally {
      setLoading(false);
    }
  }, [githubApi.customRest, owner, repoName]);

  // initial fetch
  useEffect(() => {
    if (repoName && !config && loading) {
      getConfig();
    }
  }, [config, getConfig, loading, repoName]);

  const saveConfig = useCallback(
    async (_config) => {
      try {
        setLoading(true);
        await githubApi.rest.repos.createOrUpdateFileContents({
          owner: owner,
          repo: repoName,
          path: UICMS_CONFIGS.fileName,
          message: `uicms config file ${sha ? "updated" : "created"}`,
          content: window.btoa(JSON.stringify(_config)), // base64 encode
          sha: sha,
        });
        await getConfig(); // re-fetch config as sha has been changed
      } catch (e) {
        displayError("Error saving config file!", e);
        setLoading(false);
      }
    },
    [getConfig, githubApi.rest.repos, owner, repoName, sha]
  );

  return (
    <Page loading={loading} title={repoName || "Repo"}>
      <TitleWithTabs
        title={config?.websiteName}
        subtitle={`${owner}/${repoName}`}
        tabs={[
          {
            text: "Collections",
            content: <pre>{JSON.stringify(config, null, 4)}</pre>,
            icon: <FaRegListAlt />,
            skip: !config || !sha,
          },
          {
            text: "Configuration",
            content: <Configuration config={config} saveConfig={saveConfig} />,
            icon: <FaRegSun />,
            skip: !config,
          },
          {
            text: "Website",
            href: config?.websiteUrl,
            icon: <FaGlobe />,
            skip: !config?.websiteUrl,
          },
          {
            text: "GitHub",
            href: `https://github.com/${owner}/${repoName}`,
            icon: <FaGithub />,
          },
        ]}
      />

      {!config && <NotFound setConfig={setConfig} />}
    </Page>
  );
}

function NotFound({ setConfig }) {
  function initConfig() {
    setConfig({ ...UICMS_CONFIG_STARTER_TEMPLATE });
  }

  return (
    <article className="message is-warning mt-3">
      <div className="message-header">
        <p>Incompatible repo</p>
      </div>
      <div className="message-body">
        This repo is missing <code>{UICMS_CONFIGS.fileName}</code> file in the
        root directory. That means this repo hasn&apos;t been configured to work
        with UICMS.
        <div className="block mt-5">
          <p className="">
            Would you like to set UICMS up in this repo ?
            <button
              onClick={initConfig}
              className="button is-primary is-small ml-2"
            >
              Let&apos;s do it
            </button>
          </p>
        </div>
      </div>
    </article>
  );
}

function Configuration({ config, saveConfig }) {
  const [conf, setConf] = useState({ ...config }); // local version

  function onChange(e) {
    const { name, value } = e;
    const _conf = { ...conf, [name]: value };
    setConf(_conf);
  }

  function hasChanges() {
    return JSON.stringify(conf) !== JSON.stringify(config);
  }

  return (
    <section className="box is-shadowless has-background-white-bis p-3 pb-6">
      <div className="mt-3 mx-auto w-50 w-100-sm">
        <InputWithHelp
          name="websiteName"
          value={conf?.websiteName}
          onChange={onChange}
          label="Website name"
          help="Just a name to identify for yourself."
          placeholder="Bob's personal blog"
          required={true}
        />
        <InputWithHelp
          name="websiteUrl"
          value={conf?.websiteUrl}
          onChange={onChange}
          label="Website URL"
          placeholder="https://mycoolblog.com"
        />
        <InputWithHelp
          name="assetsDirectory"
          value={conf?.assetsDirectory}
          onChange={onChange}
          label="Assets directory"
          help="The git directory where you would like static asset files (like images) to be stored."
          placeholder="_contents/assets"
          required={true}
        />
        <InputWithHelp
          name="collectionsDirectory"
          value={conf?.collectionsDirectory}
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
        <button
          onClick={async () => saveConfig(conf)}
          disabled={!hasChanges()}
          className="button is-primary float-right"
        >
          Save changes
        </button>
      </div>
    </section>
  );
}

function InputWithHelp({
  name,
  value,
  onChange,
  label = "",
  help = "",
  placeholder = "",
  required = false,
}) {
  return (
    <div className="field mb-5">
      <label className="label d-inline-block d-block-sm mr-6 mb-1">
        {label}
        {required && <span className="has-text-danger-dark ml-1">*</span>}
      </label>
      <p className="help d-inline-block d-block-sm mt-0 mb-1 float-right float-left-sm">
        {help}
      </p>
      <div className="control">
        <TextInput
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
