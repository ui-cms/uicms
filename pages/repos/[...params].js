import Page from "@/components/layout/page";
import { UICMS_CONFIGS } from "@/helpers/constants";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import TitleWithTab from "@/components/titleWithTabs";

const VIEWS = { configuration: "configuration", collections: "collections" };

export default function Repo() {
  const { query } = useRouter();
  const [owner, repoName] = query.params ? query.params : [];
  // const [repo, setRepo] = useState(null);
  const [config, setConfig] = useState(null);
  const [view, setView] = useState(VIEWS.configuration);
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
      <TitleWithTab
        title={config?.websiteName}
        subtitle={`${owner}/${repoName}`}
        tabs={[
          { text: "GitHub", href: `https://github.com/${owner}/${repoName}` },
          { text: "Website", href: config?.websiteUrl },
          { text: "Configuration", onClick: () => setView(VIEWS.configuration) },
        ]}
      />

      {config === "NotFound" ? (
        <NotFound />
      ) : (
        config &&
        (view === VIEWS.collections ? (
          <pre>{JSON.stringify(config, null, 4)}</pre>
        ) : (
          <Config />
        ))
      )}
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

function Config() {
  return (
    <section>
      <p className="title is-6">Configuration</p>
    </section>
  );
}
