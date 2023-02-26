import Page from "@/components/layout/page";
import { UICMS_CONFIGS } from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe, FaRegSun, FaRegListAlt } from "react-icons/fa";

import TitleWithTabs from "@/components/TitleWithTabs";
import { TextInput } from "@/components/form";

const VIEWS = { configuration: "configuration", collections: "collections" };

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
            setConfig("NotFound");
          } else displayError("Error fetching config file!", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [config, githubApi.rest.repos, loading, owner, repoName]);

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
          },
          {
            text: "Configuration",
            content: <Config config={config} />,
            icon: <FaRegSun />,
          },
          { text: "Website", href: config?.websiteUrl, icon: <FaGlobe /> },
          {
            text: "GitHub",
            href: `https://github.com/${owner}/${repoName}`,
            icon: <FaGithub />,
          },
        ]}
      />

      {config === "NotFound" && <NotFound />}
    </Page>
  );
}

function NotFound() {
  return (
    <article className="message is-warning">
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

function Config({ config }) {
  function onChange(e) {}

  return (
    <section className="box is-shadowless has-background-white-bis p-3">
      <p className="title is-6">Configuration</p>

      <div className="field">
        <label className="label">Website name</label>
        <div className="control">
          <TextInput
            name="websiteName"
            value={config?.websiteName}
            onChange={onChange}
            className="input"
            placeholder="Bobs personal blog"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Website URL</label>
        <div className="control">
          <TextInput
            name="websiteName"
            value={config?.websiteUrl}
            onChange={onChange}
            className="input"
            placeholder="https://mycoolblog.com"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Assets directory</label>
        <div className="control">
          <TextInput
            name="websiteName"
            value={config?.websiteUrl}
            onChange={onChange}
            className="input"
            placeholder="https://mycoolblog.com"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Collections directory</label>
        <div className="control">
          <TextInput
            name="websiteName"
            value={config?.websiteUrl}
            onChange={onChange}
            className="input"
            placeholder="https://mycoolblog.com"
          />
        </div>
      </div>
    </section>
  );
}
