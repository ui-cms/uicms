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

export function Items() {
  const router = useRouter();
  const itemId = router.query.item;
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
  });
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const { items, selectedRepo, selectedCollection } = state;

  useEffect(() => {
    const _items = items[selectedRepo.id]?.[selectedCollection.id];
    if (_items?.length) {
      setItemsList(_items);
      const selected = _items.find((i) => i.startsWith(itemId));
      if (selected) {
        setSelectedItem(selected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, items]); // only trigger when itemId in url or items list in state management changes

  return (
    <>
      {/* <SelectedRepoDetails
        repo={selectedRepo}
        currentUserName={currentUser?.login}
      /> */}
      {/* <SearchArea filters={filters} setFilters={setFilters} /> */}
      <ItemList items={itemsList} filters={filters} selectedItem={selectedItem} />
    </>
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
        className="bg-light"
      />
    </form>
  );
}

function ItemList({ items, filters, selectedItem }) {
  const router = useRouter();

  const filteredItems = useMemo(
    () =>
      items
        .sort()
        .map((i) => i.substring(11, i.length).replaceAll("_", " ")) // first 11 chars are dates and underscore. That helps with uniqueness and sorting (by date)
        .filter(
          (i) =>
            !filters.search ||
            (filters.search.toLowerCase() &&
              i.toLowerCase().includes(filters.search))
        ),

    [filters.search, items]
  );

  function onClick(item) {
    router.push(
      item === selectedItem
        ? `/${repoId}/${collection.id}`
        : `/${repoId}/${collection.id}/${item}`,
      undefined,
      {
        shallow: true, // only change params in router, not load the page
      }
    ); // if selected already, unselect, otherwise redirect to item page
  }

  return filteredItems.length === 0 ? (
    <p>No items found</p>
  ) : (
    <ul className={styles.listArea}>
      {filteredItems.map((r) => {
        const selected = r === selectedItem;
        return (
          <li key={r}>
            <a
              onClick={() => onClick(r)}
              className={selected ? styles.active : ""}
              href="#"
            >
              <Icon path={mdiLockOpenOutline} size={0.75} className="mr-1" />
              <span className="text-overflow">{r}</span>
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
