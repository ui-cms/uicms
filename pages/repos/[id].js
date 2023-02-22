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
  const { id } = query;
  const [repo, setRepo] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos } = state;

  useEffect(() => {
    if (id && !repo && repos.length > 0) {
      const _repo = repos.find((r) => r.id.toString() === id);
      if (_repo) {
        setRepo(_repo);
      }
    }
  }, [id, repo, repos]);

  useEffect(() => {
    if (repo && !content && !loading) {
      (async () => {
        setLoading(true);
        try {
          const res = await githubApi.rest.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: "uicms.config.json",
            mediaType: {
              format: "raw", // otherwise content will be returned in base64
            },
          });
          setContent(res.data);
        } catch (e) {
          if (e.status === 404) {
            setContent("NotFound");
          } else displayError("Error fetching config file!", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [content, githubApi.rest.repos, loading, repo]);

  return (
    repo && (
      <Page title={repo.name || "Repo"}>
        <h1 className="title is-3">{repo.name}</h1>
        <h1 className="subtitle">{repo.description}</h1>

        {loading ? (
          <h1>Loading</h1>
        ) : !content ? null : content === "NotFound" ? (
          <article className="message is-warning">
            <div className="message-header">
              <p>Incompatible repo</p>
            </div>
            <div className="message-body">
              This repo is missing <code>uicms.config.json</code> file in the
              root directory. That means this repo hasn&apos;t been configured
              to work with UICMS.
              <div className="block mt-5">
                <p className="">
                  Would you like to set <strong>UICMS</strong> up in this repo ?
                </p>
                <button className="button is-primary is-small mt-2">
                  Let&apos;s do it
                </button>
              </div>
            </div>
          </article>
        ) : (
          <pre>{content}</pre>
        )}
      </Page>
    )
  );
}
