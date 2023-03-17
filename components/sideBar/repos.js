import { useEffect, useState, useMemo } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { displayError, orderBy } from "@/helpers/utilities";
import { UICMS_TOPIC } from "@/helpers/constants";
import { CheckBox, TextInput } from "../form";
import Icon from "@mdi/react";
import { mdiLock, mdiLockOpenOutline, mdiStarOutline } from "@mdi/js";
import styles from "@/styles/SideBar.module.scss";
import Loader from "@/components/loader";

export function Repos({}) {
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
      starred: r.topics.includes(UICMS_TOPIC),
    }));
    return orderBy(result, "starred", false);
  }, [filters, repos]);

  return loading ? (
    <Loader />
  ) : (
    <section className={styles.repos}>
      <form>
        <TextInput
          name="search"
          value={filters.search}
          onChange={changeFilter}
          placeholder="Search"
          className="bg-light"
        />
        <CheckBox
          name="public"
          value={filters.public}
          onChange={changeFilter}
          label="Public"
        />
        <CheckBox
          name="private"
          value={filters.private}
          onChange={changeFilter}
          label="Private"
        />
      </form>
      <ul>
        {filteredRepos.length === 0 ? (
          <li>No repos found</li>
        ) : (
          filteredRepos.map((repo) => {
            return (
              <li key={repo.id}>
                <a href={`repos/${repo.owner}/${repo.name}`}>
                  {hasUICMSTopic(repo) && (
                    <Icon path={mdiStarOutline} size={0.8} className="text-primary mr-1" title="Has UICMS topic"/>
                  )}
                  <Icon
                    path={repo.private ? mdiLock : mdiLockOpenOutline}
                    title={repo.private ? "Private repo" : "Public repo"}
                    size={0.8}
                    className="mr-1"
                  />

                  {repo.name}
                </a>
              </li>
            );
          })
        )}
      </ul>
      <ul>
        {filteredRepos.length === 0 ? (
          <li>No repos found</li>
        ) : (
          filteredRepos.map((repo) => {
            return (
              <li key={repo.id}>
                <a href={`repos/${repo.owner}/${repo.name}`}>
                  {hasUICMSTopic(repo) && (
                    <Icon path={mdiStarOutline} size={0.8} className="text-primary mr-1" title="Has UICMS topic"/>
                  )}
                  <Icon
                    path={repo.private ? mdiLock : mdiLockOpenOutline}
                    title={repo.private ? "Private repo" : "Public repo"}
                    size={0.8}
                    className="mr-1"
                  />

                  {repo.name}
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
