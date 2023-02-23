import Page from "@/components/layout/page";
import Tabs from "@/components/tabs";
import { displayError, orderBy } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";

export default function Repo() {
  const { query } = useRouter();
  const [owner, repoName] = query.params ? query.params : [];
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  useEffect(() => {
    if (repoName && !config && loading) {
      (async () => {
        try {
          const res = await githubApi.rest.repos.getContent({
            owner: owner,
            repo: repoName,
            path: "uicms.config.json",
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
      <div className="columns">
        {config?.siteName && (
          <div className="column is-half">
            <h1 className="title is-3">{config.siteName}</h1>
          </div>
        )}
        <div className="column is-half">
          <h1 className="subtitle is-3">
            {owner}/{repoName}
          </h1>
        </div>
      </div>

      {loading ? (
        <h1>Loading</h1>
      ) : !config ? null : config === "NotFound" ? (
        <article className="message is-warning">
          <div className="message-header">
            <p>Incompatible repo</p>
          </div>
          <div className="message-body">
            This repo is missing <code>uicms.config.json</code> file in the root
            directory. That means this repo hasn&apos;t been configured to work
            with UICMS.
            <div className="block mt-5">
              <p className="">
                Would you like to set UICMS up in this repo ?{" "}
                <button className="button is-primary is-small ml-2">
                  Let&apos;s do it
                </button>
              </p>
            </div>
          </div>
        </article>
      ) : (
        <pre>{JSON.stringify(config, null, 4)}</pre>
      )}
    </Page>
  );
}
