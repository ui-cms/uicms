import Page from "@/components/page";
import { displayError, orderBy } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";

export default function Repos() {
  const [displayAll, setDisplayAll] = useState(false);
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

      <div className="tabs">
        <ul>
          <li className={!displayAll ? "is-active" : ""}>
            <a onClick={() => setDisplayAll(false)}>Recently updated</a>
          </li>
          <li className={displayAll ? "is-active" : ""}>
            <a onClick={() => setDisplayAll(true)}>All</a>
          </li>
        </ul>
      </div>

      {displayAll ? (
        <AllRepos repos={repos} />
      ) : (
        <RecentlyUpdated repos={repos} />
      )}
    </Page>
  );
}

function RecentlyUpdated({ repos }) {
  const recentPosts = repos.slice(0, 4);
  return (
    <div className="tile is-ancestor">
      {recentPosts.map((repo) => (
        <div key={repo.id} className="tile is-3">
          <div className="tile">
            <div className="tile is-parent">
              <a className="tile is-child notification is-primary is-light">
                <p className="title is-4">{repo.name}</p>
                <p className="subtitle is-5">{repo.description || ""}</p>
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
          </div>
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
            </Link>
          );
        })}
    </div>
  );
}
