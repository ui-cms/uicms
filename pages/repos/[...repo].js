import Page from "@/components/layout/page";
import {
  UICMS_CONFIGS,
  UICMS_CONFIG_STARTER_TEMPLATE,
} from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FaGithub, FaGlobe, FaRegSun, FaRegListAlt } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { TextInput } from "@/components/form";
import TitleWithTabs from "@/components/titleWithTabs";

export default function Repo() {
  const router = useRouter();
  const [repoOwner, repoName] = router.query.repo || [];
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const [repo, setRepo] = useState(null);
  const sha = repo?.configFile.sha;
  const config = repo?.configFile.data;

  const getConfig = useCallback(async () => {
    try {
      const res = await githubApi.customRest.getFileContentAndSha(
        repoOwner,
        repoName,
        UICMS_CONFIGS.fileName
      );
      const _repo = {
        ...repo,
        configFile: { sha: res.sha, data: JSON.parse(res.content) },
      };
      dispatchAction.updateRepo(_repo);
    } catch (e) {
      // when 404, no config file, incompatible repo
      if (e.status !== 404) {
        displayError("Error fetching config file!", e);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatchAction, githubApi.customRest, repoOwner, repo, repoName]);

  // Initial fetch repo from state management
  useEffect(() => {
    let _repo = null;
    if (state.repos.length > 0 && repoOwner && repoName) {
      _repo = state.repos.find(
        (r) => r.owner === repoOwner && r.name === repoName
      );
      if (_repo) {
        setRepo(_repo);
        if (_repo.configFile.data) {
          setLoading(false);
        }
      }
    }

    // If landed directly to this page and repos have not been loaded to state management yet, redirect to repos page
    if (!_repo) {
      router.push("/repos");
    }
  }, [repoName, repoOwner, router, state.repos]);

  // If repo doesn't have config file data yet, fetch it
  useEffect(() => {
    if (repo && !repo.configFile.data && loading) {
      getConfig();
    }
  }, [getConfig, loading, repo]);

  const saveConfig = useCallback(
    async (_config) => {
      try {
        setLoading(true);
        await githubApi.rest.repos.createOrUpdateFileContents({
          owner: repoOwner,
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
    [getConfig, githubApi.rest.repos, repoOwner, repoName, sha]
  );

  return (
    <Page loading={loading} title={repoName || "Repo"}>
      <TitleWithTabs
        title={config?.websiteName}
        subtitle={`${repoOwner}/${repoName}`}
        tabs={[
          {
            text: "Collections",
            content: <Collections config={config} />,
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
            href: `https://github.com/${repoOwner}/${repoName}`,
            icon: <FaGithub />,
          },
        ]}
      />

      {!config && (
        <NotFound
          setConfig={(conf) => setRepo({ ...repo, configFile: { data: conf } })}
        />
      )}
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

function Collections({ config }) {
  return (
    <section className="columns mt-3">
      <aside className="column is-one-fifth uc-parts">
        <div className="is-flex is-align-items-center mb-2">
          <p className="uc-w-100 title is-5 m-0">Collections</p>
          <button className="button is-primary is-light">
            <span className="icon mr-1">
              <FcPlus />
            </span>
            New
          </button>
        </div>

        <a className="uc-part">Blog</a>
        <a className="uc-part">Blog</a>
        <a className="uc-part">Blog</a>
        <a className="uc-part">Blog</a>
        <a className="uc-part">Blog</a>
        <a className="uc-part active">Blog</a>
      </aside>
      <div className="column">
        <pre>{JSON.stringify(config, null, 4)}</pre>
      </div>
    </section>
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
    <section className="uc-mx-n2 pt-5">
      <div className="uc-parts mx-auto uc-w-50 uc-w-100-sm">
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
        <div className="uc-part is-clearfix">
          <button
            onClick={async () => saveConfig(conf)}
            disabled={!hasChanges()}
            className="button is-primary is-pulled-right"
          >
            Save changes
          </button>
        </div>
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
    <div className="uc-part field">
      <label className="label uc-d-inline-block uc-d-block-sm mr-6 mb-1">
        {label}
        {required && <span className="has-text-danger-dark ml-1">*</span>}
      </label>
      <p className="help uc-d-inline-block uc-d-block-sm mt-0 mb-1 is-pulled-right uc-float-left-sm">
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
