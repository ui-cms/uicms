import Page from "@/components/layout/page";
import Tabs from "@/components/tabs";
import { displayError } from "@/helpers/utilities";
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
          {
            title: "Repos with UICMS topic",
            content: <MarkedRepos repos={repos} />,
          },
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
          <Link
            href={`repos/${repo.owner.login}/${repo.name}`}
            // href={`repos/${repo.name}?owner=${repo.owner.login}`}
            className="tile is-child notification is-primary is-light"
          >
            <p className="title is-5">{repo.name}</p>
            <p className="subtitle is-6">{repo.description || "-"}</p>
            <ul>
              <li className="mb-2">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="icon-text mr-2"
                >
                  <span className="icon">
                    <FaGithub size={20} />
                  </span>
                  <span>{repo.full_name}</span>
                </Link>
              </li>
              {repo.homepage && (
                <li>
                  <Link
                    href={repo.homepage}
                    target="_blank"
                    className="icon-text"
                  >
                    <span className="icon">
                      <FaGlobe size={20} />
                    </span>
                    <span>{repo.homepage}</span>
                  </Link>
                </li>
              )}
            </ul>
          </Link>
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
