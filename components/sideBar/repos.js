import { useEffect, useState, useMemo, useRef } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { displayError, orderBy } from "@/helpers/utilities";
import { CheckBox, TextInput } from "../form";
import Icon from "@mdi/react";
import {
  mdiAt,
  mdiCheck,
  mdiCogOutline,
  mdiDotsVertical,
  mdiGit,
  mdiGithub,
  mdiLock,
  mdiLockOpenOutline,
  mdiStar,
  mdiStarOutline,
  mdiWeb,
} from "@mdi/js";
import styles from "@/styles/SideBar.module.scss";
import { Button } from "../button";
import DropDown from "../dropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import { UICMS_CONFIGS } from "@/helpers/constants";

export function Repos({ setLoading }) {
  const loaded = useRef(false);
  const [filters, setFilters] = useState({
    search: "",
    private: true,
    public: true,
  });
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos, selectedRepo, currentUser } = state;

  useEffect(() => {
    if (currentUser && repos.length === 0 && !loaded.current) {
      (async () => {
        setLoading(true);
        loaded.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // trigger only when currentUser gets updated

  return (
    loaded && (
      <>
        <SelectedRepoDetails
          repo={selectedRepo}
          currentUserName={currentUser?.login}
        />
        <SearchArea filters={filters} setFilters={setFilters} />
        <RepoList
          repos={repos}
          filters={filters}
          selectedRepoId={selectedRepo?.id}
        />
      </>
    )
  );
}

function SelectedRepoDetails({ repo, currentUserName }) {
  const starred = hasUICMSTopic(repo);
  return (
    repo && (
      <div className={styles.selectedArea}>
        <h3 title={repo.full_name}>
          {repo.owner !== currentUserName && (
            <small className="text-dark">
              <Icon path={mdiAt} size={0.65} className="mr-1" />
              <span className="text-overflow">{repo.owner}</span>
            </small>
          )}
          <p className="mb-1">
            <Icon path={mdiGit} size={1} className="mr-1 text-dark" />
            <span className="text-overflow">{repo.name}</span>
          </p>
        </h3>
        <div className={styles.dropdown}>
          <DropDown
            direction="right"
            handle={
              <Button onClick={() => {}} title="More options">
                <Icon path={mdiDotsVertical} size={0.95} />
              </Button>
            }
          >
            <div className={styles.dropdownOptions}>
              <Link href={`/${repo.id}/configuration`}>
                <Icon path={mdiCogOutline} size={0.7} className="mr-1" />
                Configuration
              </Link>
              <Link href={repo.html_url} target="_blank">
                <Icon path={mdiGithub} size={0.7} className="mr-1" />
                Source code
              </Link>
              {repo.homepage && (
                <Link href={repo.homepage} target="_blank">
                  <Icon path={mdiWeb} size={0.7} className="mr-1" />
                  Homepage
                </Link>
              )}
              <a onClick={() => alert("todo")} href="#">
                <Icon
                  path={starred ? mdiStarOutline : mdiStar}
                  size={0.7}
                  className="mr-1"
                />
                {starred ? "Unstar" : "Star"}
              </a>
            </div>
          </DropDown>
        </div>
      </div>
    )
  );
}

function SearchArea({ filters, setFilters }) {
  function onChange({ name, value }) {
    setFilters({ ...filters, [name]: value });
  }

  return (
    <form className={styles.searchArea}>
      <TextInput
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search"
        className="bg-light mw-50"
      />
      <CheckBox name="public" value={filters.public} onChange={onChange}>
        Public
      </CheckBox>
      <CheckBox name="private" value={filters.private} onChange={onChange}>
        Private
      </CheckBox>
    </form>
  );
}

function RepoList({ repos, filters, selectedRepoId }) {
  const router = useRouter();

  const filteredRepos = useMemo(() => {
    let result = repos.filter(
      (r) =>
        ((filters.private && r.private) || (filters.public && !r.private)) &&
        (!filters.search ||
          (filters.search.toLowerCase() &&
            r.name.toLowerCase().includes(filters.search)))
    );

    // display starred (having UICMS topic) ones first
    result = result.map((r) => ({
      ...r,
      starred: hasUICMSTopic(r),
    }));
    return orderBy(result, "starred", false);
  }, [filters, repos]);

  function onClick(repo) {
    router.push(
      repo.id === selectedRepoId ? "/start" : `/${repo.id}`,
      undefined,
      {
        shallow: true, // only change params in router, not load the page
      }
    ); // if selected already, unselect (return to start page), otherwise redirect to repo page
  }

  return filteredRepos.length === 0 ? (
    <p>No repos found</p>
  ) : (
    <ul className={styles.listArea}>
      {filteredRepos.map((r) => {
        const selected = r.id === selectedRepoId;
        return (
          <li key={r.id}>
            <a
              onClick={() => onClick(r)}
              className={selected ? styles.active : ""}
              href="#"
            >
              {hasUICMSTopic(r) && (
                <Icon
                  path={mdiStar}
                  size={0.75}
                  className="text-primary mr-1"
                  title="Starred (has UICMS topic)"
                />
              )}
              <Icon
                path={r.private ? mdiLock : mdiLockOpenOutline}
                title={r.private ? "Private repo" : "Public repo"}
                size={0.75}
                className="mr-1"
              />
              <span className="text-overflow" title={r.full_name}>
                {r.name}
              </span>
              {selected && (
                <Icon
                  path={mdiCheck}
                  size={0.75}
                  className="ml-1"
                  title="Selected repo"
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function hasUICMSTopic(repo) {
  return repo && repo.topics.includes(UICMS_CONFIGS.topic);
}
