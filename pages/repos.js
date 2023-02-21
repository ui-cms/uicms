import Page from "@/components/page";
import Tabs from "@/components/tabs";
import { displayError, orderBy } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";

export default function Repos() {
  const loading = useRef(false);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos } = state;

  useEffect(() => {
    if (state.currentUser && repos.length === 0 && !loading.current) {
      (async () => {
        loading.current = true;
        try {
          const res = await githubApi.customRest.listAuthenticatedUsersRepos();
          orderBy(res.data, "pushed_at", false);
          dispatchAction.setRepos(res.data);
        } catch (e) {
          displayError("Error fetching authenticated user's repos!", e);
        } finally {
          loading.current = false;
        }
      })();
    }
  }, [
    dispatchAction,
    githubApi.customRest,
    loading,
    repos.length,
    state.currentUser,
  ]);

  return (
    <Page title="My repos">
      <h1 className="title is-3">Select a repo</h1>
      <h1 className="subtitle">Your repos from GitHub are display below</h1>

      <Tabs
        items={[
          { title: "Repos with UICMS topic", content: <MarkedRepos repos={repos} /> },
          { title: "All", content: <AllRepos repos={repos} /> },
        ]}
      />
    </Page>
  );
}

function MarkedRepos({ repos }) {
  const markedRepos = repos.filter((r) => hasUICMSTopic(r));
  return (
    <div className="columns is-multiline">
      {markedRepos.map((repo) => (
        <div key={repo.id} className="column is-one-quarter tile">
          <a className="tile is-child notification is-primary is-light">
            <p className="title is-5">{repo.name}</p>
            <p className="subtitle is-6">{repo.description || "-"}</p>
            <ul>
              <li>
                <a
                  href={repo.html_url}
                  target="_blank"
                  className="icon-text mr-2"
                  rel="noreferrer"
                >
                  <span class="icon">
                    <FaGithub size={20} />
                  </span>
                  <span>{repo.full_name}</span>
                </a>
              </li>
              {repo.homepage && (
                <li>
                  <a
                    href={repo.homepage}
                    target="_blank"
                    className="icon-text"
                    rel="noreferrer"
                  >
                    <span class="icon">
                      <FaGlobe size={20} />
                    </span>
                    <span>{repo.homepage}</span>
                  </a>
                </li>
              )}
            </ul>
          </a>
        </div>
      ))}
    </div>
  );
}

function AllRepos({ repos }) {
  return (
    <div className="box p-0 is-shadowless">
      {repos.length > 0 &&
        repos.map((repo) => {
          return (
            <Link
              href={`repos/${repo.id}`}
              key={repo.id}
              className="panel-block"
            >
              {repo.name}
              {repo.private && (
                <span className="ml-4 tag is-dark">Private</span>
              )}
              {hasUICMSTopic(repo) && (
                <span className="ml-4 tag is-primary">UICMS</span>
              )}
            </Link>
          );
        })}
    </div>
  );
}

function hasUICMSTopic(repo) {
  return repo.topics.includes("uicms");
}
