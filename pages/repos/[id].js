import Page from "@/components/page";
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
  const loading = useRef(false);
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
    if (repo && !content && !loading.current) {
      (async () => {
        loading.current = true;
        try {
          const res = await githubApi.rest.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: "uicms.config.json",    mediaType: {
              format: "raw"
          }
          });
          setContent(res.data);
        } catch (e) {
          if (e.status === 404) {
            setContent("NotFound");
          } else displayError("Error fetching config file!", e);
        } finally {
          loading.current = false;
        }
      })();
    }
  }, [dispatchAction, githubApi.rest.repos, repo]);

  return (
    repo && (
      <Page title={repo.name || "Repo"}>
        <h1 className="title is-3">{repo.name}</h1>
        <h1 className="subtitle">{repo.description}</h1>

        {content === "NotFound" && (
          <p>
            This repo is missing <code>uicms.config.json</code> file. Meaning
            this repo hasn&apos;t been set to work with UICMS.
          </p>
        )}
        {content && <pre>{JSON.stringify(content, null, 4)}</pre>}
      </Page>
    )
  );
}
