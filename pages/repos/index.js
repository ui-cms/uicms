import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaDatabase, FaGithub, FaGlobe, FaStar, FaPlay, FaSearch } from "react-icons/fa";
import { MdLock, MdLockOpen, MdSearch, MdUpdate } from "react-icons/md";
import { CheckBox, TextInput } from "@/components/form";
import Page from "@/components/layout/page";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import TitleWithTabs from "@/components/titleWithTabs";
import { UICMS_TOPIC } from "@/helpers/constants";

export default function Repos() {
  const [loading, setLoading] = useState(false);
  const started = useRef(false); // used to prevent double call
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos } = state;

  useEffect(() => {
    if (state.currentUser && repos.length === 0 && !started.current) {
      (async () => {
        setLoading(true);
        started.current = true;
        try {
          const res = await githubApi.customRest.listAuthenticatedUsersRepos();
          dispatchAction.setRepos(res.data);
        } catch (e) {
          displayError("Error fetching repos!", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [dispatchAction, githubApi.customRest, repos.length, state.currentUser]);

  return (
    <Page loading={loading} title="My repos">
      <TitleWithTabs
        title="My repos"
        subtitle="Select one to get started"
        tabs={[
          {
            text: "Tagged",
            content: <TaggedRepos repos={repos} />,
            icon: <FaStar />,
          },
          {
            text: "All",
            content: <AllRepos repos={repos} />,
            icon: <FaDatabase />,
          },
        ]}
      />
    </Page>
  );
}

function TaggedRepos({ repos }) {
  const taggedRepos = repos.filter((r) => hasUICMSTopic(r));
  return (
    <div className="columns is-multiline mt-1">
      {taggedRepos.map((repo) => {
        const url = `repos/${repo.owner}/${repo.name}`;
        return (
          <div
            key={repo.id}
            className="column is-one-quarter-desktop is-one-third-tablet"
          >
            <div className="card uc-overflow-hidden has-background-primary-light is-shadowless">
              <Link href={url}>
                <div className="card-content px-4 py-3">
                  <div className="media mb-3">
                    <div className="media-left">
                      <span className="panel-icon mt-2 has-text-primary-dark">
                        {repo.private ? (
                          <MdLock size={24} title="Private repo" />
                        ) : (
                          <MdLockOpen size={24} title="Public repo" />
                        )}
                      </span>
                    </div>
                    <div className="media-content">
                      <p className="title is-5 has-text-primary-dark uc-text-overflow">
                        {repo.name}
                      </p>
                      <p className="subtitle is-6 has-text-primary-dark uc-text-overflow">
                        @{repo.owner}
                      </p>
                    </div>
                  </div>

                  <div className="content has-text-primary-dark">
                    <p className="mb-2 uc-text-overflow">{repo.description}</p>
                  </div>
                </div>
              </Link>
              <footer className="card-footer has-text-primary-dark">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="card-footer-item icon-text p-2"
                >
                  <span className="icon">
                    <FaGithub size={18} />
                  </span>
                  <span>GitHub</span>
                </Link>
                <Link
                  href={repo.homepage || "#"}
                  target={repo.homepage ? "_blank" : ""}
                >
                  <span className="icon">
                    <FaGlobe size={18} />
                  </span>
                  <span>Website</span>
                </Link>
                <Link href={url} className="card-footer-item icon-text p-2">
                  <span className="icon">
                    <FaSearch size={18} />
                  </span>
                  <span>View</span>
                </Link>
              </footer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AllRepos({ repos }) {
  const [filters, setFilters] = useState({
    search: "",
    private: true,
    public: true,
    uicms: false,
  });

  function changeFilter({ name, value }) {
    setFilters({ ...filters, [name]: value });
  }

  const filteredRepos = useMemo(
    () =>
      repos.filter(
        (r) =>
          ((filters.private && r.private) || (filters.public && !r.private)) &&
          (!filters.uicms || (filters.uicms && hasUICMSTopic(r))) &&
          (!filters.search ||
            (filters.search.toLowerCase() &&
              r.name.toLowerCase().includes(filters.search)))
      ),
    [filters, repos]
  );

  return (
    <section className="panel is-shadowless p-0 box mt-3">
      <div className="p-3 mb-2">
        <div className="columns">
          <div className="column is-one-third">
            <p className="control has-icons-left">
              <TextInput
                name="search"
                value={filters.search}
                onChange={changeFilter}
                className="input"
                placeholder="Search"
              />
              <span className="icon is-left">
                <MdSearch className=" is-size-3" />
              </span>
            </p>
          </div>
          <div className="column is-flex is-align-self-center">
            <p className="control has-icons-left">
              <CheckBox
                name="public"
                value={filters.public}
                onChange={changeFilter}
                label="Public"
              />
            </p>
            <p className="control has-icons-left ml-4">
              <CheckBox
                name="private"
                value={filters.private}
                onChange={changeFilter}
                label="Private"
              />
            </p>
            <p className="control has-icons-left ml-6">
              <CheckBox
                name="uicms"
                value={filters.uicms}
                onChange={changeFilter}
                label="UICMS"
              />
            </p>
          </div>
        </div>
      </div>
      {filteredRepos.length === 0 ? (
        <p className="panel-block">Nothing found</p>
      ) : (
        filteredRepos.map((repo) => {
          return (
            <Link
              href={`repos/${repo.owner}/${repo.name}`}
              key={repo.id}
              className="panel-block uc-text-overflow"
            >
              <span className="panel-icon is-size-5">
                {repo.private ? (
                  <MdLock />
                ) : (
                  <MdLockOpen className="has-text-grey-light" />
                )}
              </span>
              {repo.name}
              {hasUICMSTopic(repo) && ( // have it first
                <span className="ml-4 tag is-primary">{UICMS_TOPIC}</span>
              )}
              {repo.topics.map((topic) =>
                topic === UICMS_TOPIC ? null : (
                  <span key={topic} className="ml-4 tag is-light">
                    {topic}
                  </span>
                )
              )}
            </Link>
          );
        })
      )}
    </section>
  );
}

function hasUICMSTopic(repo) {
  return repo.topics.includes(UICMS_TOPIC);
}
