import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaDatabase, FaGithub, FaGlobe, FaStar } from "react-icons/fa";
import { MdLock, MdLockOpen, MdSearch } from "react-icons/md";
import { CheckBox, TextInput } from "@/components/form";
import Page from "@/components/layout/page";
import Tabs from "@/components/tabs";
import { displayError } from "@/helpers/utilities";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import TitleWithTabs from "@/components/titleWithTabs";

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
            content: <MarkedRepos repos={repos} />,
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

function MarkedRepos({ repos }) {
  const markedRepos = repos.filter((r) => hasUICMSTopic(r));
  return (
    <div className="columns is-multiline mt-1">
      {markedRepos.map((repo) => (
        <div
          key={repo.id}
          className="column is-one-quarter-desktop is-one-third-tablet tile"
        >
          <Link
            href={`repos/${repo.owner.login}/${repo.name}`}
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
    <section className="panel is-shadowless p-0 box">
      <div className="has-background-white-bis p-3">
        <div className="columns">
          <div className="column">
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
              href={`repos/${repo.owner.login}/${repo.name}`}
              key={repo.id}
              className="panel-block"
            >
              <span className="panel-icon is-size-5">
                {repo.private ? (
                  <MdLock />
                ) : (
                  <MdLockOpen className="has-text-grey-light" />
                )}
              </span>
              {repo.name}
              {hasUICMSTopic(repo) && (
                <span className="ml-4 tag is-primary">UICMS</span>
              )}
            </Link>
          );
        })
      )}
    </section>
  );
}

function hasUICMSTopic(repo) {
  return repo.topics.includes("uicms");
}
