import { useEffect, useState, useMemo } from "react";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { TextInput } from "../form";
import Icon from "@mdi/react";
import {
  mdiCheck,
  mdiDeleteOutline,
  mdiDotsVertical,
  mdiFileCheckOutline,
  mdiFileOutline,
} from "@mdi/js";
import styles from "@/styles/SideBar.module.scss";
import { Button } from "../button";
import DropDown from "../dropdown";
import { useRouter } from "next/router";
import { isNullOrEmpty } from "@/helpers/utilities";

export function Items() {
  const [itemsList, setItemsList] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
  });
  const { state } = useStateManagement();
  const { items, selectedRepo, selectedCollection, selectedItem } = state;

  useEffect(() => {
    const _items = items[selectedRepo.id]?.[selectedCollection.id];
    setItemsList(isNullOrEmpty(_items) ? [] : _items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); // only trigger when items list in state management changes

  return (
    <>
      <SelectedItemDetails item={selectedItem} />
      {itemsList?.length > 5 && (
        <SearchArea filters={filters} setFilters={setFilters} />
      )}
      <ItemList
        items={itemsList}
        filters={filters}
        selectedItem={selectedItem}
        repoId={selectedRepo?.id}
        collectionId={selectedCollection?.id}
      />
    </>
  );
}

function SelectedItemDetails({ item }) {
  if (!item) return null;
  const { title } = parseItemNameToObject(item);
  return (
    <div className={styles.selectedArea}>
      <h3>
        <p className="mb-1">
          <Icon
            path={mdiFileCheckOutline}
            size={1}
            className="mr-1 text-dark"
          />
          <span className="text-overflow">{title}</span>
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
            <a onClick={() => alert("todo")} href="#">
              <Icon path={mdiDeleteOutline} size={0.7} className="mr-1" />
              Delete
            </a>
          </div>
        </DropDown>
      </div>
    </div>
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
        className="bg-light w-100"
      />
    </form>
  );
}

function ItemList({ items, filters, selectedItem, repoId, collectionId }) {
  const router = useRouter();

  const itemObjects = useMemo(
    () =>
      items
        .sort()
        .reverse() // newest date first
        .map((i) => parseItemNameToObject(i))
        .filter(
          ({ title }) =>
            !filters.search ||
            (filters.search.toLowerCase() &&
              title.toLowerCase().includes(filters.search))
        ),
    [filters.search, items]
  );

  function onClick(itemId) {
    router.push(
      selectedItem?.startsWith(itemId)
        ? `/${repoId}/${collectionId}`
        : `/${repoId}/${collectionId}/${itemId}`, // only have item id in url, slug is not needed
      undefined,
      {
        shallow: false, // not shallow
      }
    ); // if selected already, unselect, otherwise redirect to item page
  }

  return itemObjects.length === 0 ? (
    <p>No items found</p>
  ) : (
    <ul className={styles.listArea}>
      {itemObjects.map((item) => {
        const selected = selectedItem?.startsWith(item.id);
        return (
          <li key={item.id}>
            <a
              onClick={() => onClick(item.id)}
              className={selected ? styles.active : ""}
              href="#"
            >
              <Icon path={mdiFileOutline} size={0.75} className="mr-1" />
              <span className="text-overflow">{item.title}</span>
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

function parseItemNameToObject(item) {
  const index = item.indexOf("_"); // index of first underscore sign that separates id from slug
  return {
    id: Number(item.substring(0, index)), // First chars up until underscore are datetime (id) which helps with uniqueness and sorting (by date)
    title: item.substring(index + 1, item.length).replaceAll("_", " "), // Title comes after id. Includes more underscores which were used to replace spaces
  };
}
