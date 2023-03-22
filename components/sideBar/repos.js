import { useEffect, useState, useMemo } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { displayError, orderBy } from "@/helpers/utilities";
import { UICMS_TOPIC } from "@/helpers/constants";
import { CheckBox, TextInput } from "../form";
import Icon from "@mdi/react";
import {
  mdiAt,
  mdiCheck,
  mdiClose,
  mdiDotsVertical,
  mdiGit,
  mdiLock,
  mdiLockOpenOutline,
  mdiPlus,
  mdiStar,
} from "@mdi/js";
import styles from "@/styles/SideBar.module.scss";
import Loader from "@/components/loader";
import { Button } from "../button";
import Link from "next/link";
import { useRouter } from "next/router";

export function Repos({ selectedRepo, selectRepo }) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    private: true,
    public: true,
  });
  const router = useRouter();
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { repos, currentUser } = state;

  useEffect(() => {
    if (currentUser && repos.length === 0 && !loading) {
      (async () => {
        setLoading(true);
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
  }, [
    currentUser,
    dispatchAction,
    githubApi.customRest,
    loading,
    repos.length,
  ]);

  return loading ? (
    <Loader />
  ) : (
    <section className={styles.repos}>
      <SearchArea filters={filters} setFilters={setFilters} />
      <RepoList
        repos={repos}
        filters={filters}
        onSelect={selectRepo}
        selectedRepoId={selectedRepo?.id}
      />
    </section>
  );
}

function SearchArea({ filters, setFilters }) {
  function onChange({ name, value }) {
    setFilters({ ...filters, [name]: value });
  }

  return (
    <form className={styles.search}>
      <TextInput
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search"
        className="bg-light"
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

function RepoList({ repos, filters, onSelect, selectedRepoId }) {
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

  return (
    <ul className={styles.list}>
      {filteredRepos.length === 0 ? (
        <li>No repos found</li>
      ) : (
        // filteredRepos.map((r) => {
          filteredRepos.concat(filteredRepos).map((r) => {
          return (
            <li key={r.id}>
              <a
                onClick={() => onSelect(r.id === selectedRepoId ? null : r)}
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
                {selectedRepoId === r.id && (
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
        })
      )}
    </ul>
  );
}

function hasUICMSTopic(repo) {
  return repo.topics.includes(UICMS_TOPIC);
}
