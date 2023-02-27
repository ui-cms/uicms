import Page from "@/components/layout/page";
import { UICMS_CONFIGS } from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe, FaRegSun, FaRegListAlt } from "react-icons/fa";
import { TextInput } from "@/components/form";
import TitleWithTabs from "@/components/titleWithTabs";

export default function Repo() {
  const { query } = useRouter();
  const [owner, repoName] = query.params ? query.params : [];
  // const [repo, setRepo] = useState(null);
  const [config, setConfig] = useState(null);
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

  useEffect(() => {
    if (repoName && !config && loading) {
      (async () => {
        try {
          const res = await githubApi.rest.repos.getContent({
            owner: owner,
            repo: repoName,
            path: UICMS_CONFIGS.fileName,
            mediaType: {
              format: "raw", // otherwise content will be returned in base64
            },
          });
          setConfig(JSON.parse(res.data));
        } catch (e) {
          if (e.status === 404) {
            setConfig(null);
          } else displayError("Error fetching config file!", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [config, githubApi.rest.repos, loading, owner, repoName]);

  async function saveConfig(_config) {
    try {
      setLoading(true);
      const res = await githubApi.rest.repos.createOrUpdateFileContents({
        owner: owner,
        repo: repoName,
        path: UICMS_CONFIGS.fileName,
        message: "uicms config file updated",
        content: window.btoa(JSON.stringify(_config)),  // base64 encode
      });
      debugger;

      setConfig(_config);
    } catch (e) {
      if (e.status === 404) {
      } else displayError("Error saving config file!", e);
    } finally {
      setLoading(false);
    }
  }

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
            skip: !config,
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

      {!config && <NotFound />}
    </Page>
  );
}

function NotFound() {
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
            <button className="button is-primary is-small ml-2">
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
      <div className="mt-3 w-50 w-100-sm">
        <InputWithHelp
          name="websiteName"
          value={conf?.websiteName}
          onChange={onChange}
          label="Website name"
          help="Just a name to identify for yourself."
          placeholder="Bob's personal blog"
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
