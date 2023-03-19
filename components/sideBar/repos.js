import { useEffect, useState, useMemo } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { displayError, orderBy } from "@/helpers/utilities";
import { UICMS_TOPIC } from "@/helpers/constants";
import { CheckBox, TextInput } from "../form";
import Icon from "@mdi/react";
import {
  mdiAt,
  mdiClose,
  mdiDotsVertical,
  mdiGit,
  mdiLock,
  mdiLockOpenOutline,
  mdiStar,
} from "@mdi/js";
import styles from "@/styles/SideBar.module.scss";
import Loader from "@/components/loader";
import { Button } from "../button";

export function Repos({ selectedRepo, selectRepo }) {
  const [loading, setLoading] = useState(false);
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

  const [filters, setFilters] = useState({
    search: "",
    private: true,
    public: true,
  });

  function changeFilter({ name, value }) {
    setFilters({ ...filters, [name]: value });
  }

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

  return loading ? (
    <Loader />
  ) : (
    <section className={styles.repos}>
      {selectedRepo && (
        <div className={styles.selected}>
          <h3>
            <p className="mb-1">
              <Icon path={mdiGit} size={0.9} className="mr-1 text-dark" />
              <span>{selectedRepo.name}</span>
            </p>
            <small className="text-dark">
              <Icon
                path={mdiAt}
                size={0.75}
                className="mr-1"
                style={{ marginLeft: "2px" }}
              />
              <span>{selectedRepo.owner}</span>
            </small>
          </h3>
          <div className={styles.buttons}>
            <Button onClick={() => selectRepo(null)} title="Unselect">
              <Icon path={mdiClose} size={0.8} />
            </Button>
            <Button onClick={() => {}} title="More options">
              <Icon path={mdiDotsVertical} size={0.95} />
            </Button>
          </div>
        </div>
      )}
      <form>
        <TextInput
          name="search"
          value={filters.search}
          onChange={changeFilter}
          placeholder="Search"
          className="bg-light"
        />
        <CheckBox name="public" value={filters.public} onChange={changeFilter}>
          Public
        </CheckBox>
        <CheckBox
          name="private"
          value={filters.private}
          onChange={changeFilter}
        >
          Private
        </CheckBox>
      </form>
      <ul>
        {filteredRepos.length === 0 ? (
          <li>No repos found</li>
        ) : (
          filteredRepos.map((repo) => {
            return (
              <li key={repo.id}>
                <a onClick={() => selectRepo(repo)} href="#">
                  {hasUICMSTopic(repo) && (
                    <Icon
                      path={mdiStar}
                      size={0.75}
                      className="text-primary mr-1"
                      title="Starred (has UICMS topic)"
                    />
                  )}
                  <Icon
                    path={repo.private ? mdiLock : mdiLockOpenOutline}
                    title={repo.private ? "Private repo" : "Public repo"}
                    size={0.75}
                    className="mr-1"
                  />
                  <span title={repo.full_name}>{repo.name}</span>
                </a>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

function hasUICMSTopic(repo) {
  return repo.topics.includes(UICMS_TOPIC);
}
