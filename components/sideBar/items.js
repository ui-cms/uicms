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

export function Items() {
  const router = useRouter();
  const itemId = router.query.item;
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
  });
  const { state } = useStateManagement();
  const { items, selectedRepo, selectedCollection } = state;

  useEffect(() => {
    const _items = items[selectedRepo.id]?.[selectedCollection.id];
    if (_items?.length) {
      setItemsList(_items);
      if (itemId) {
        const selected = _items.find((i) => i.startsWith(itemId));
        if (selected) {
          setSelectedItem(parseItemSlugToObject(selected));
        }
      } else if (selectedItem) {
        setSelectedItem(null); // reset/unselect selected item
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, items]); // only trigger when itemId in url or items list in state management changes

  return (
    <>
      <SelectedItemDetails item={selectedItem} />
      <SearchArea filters={filters} setFilters={setFilters} />
      <ItemList
        items={itemsList}
        filters={filters}
        selectedItemId={selectedItem?.id}
        repoId={selectedRepo?.id}
        collectionId={selectedCollection?.id}
      />
    </>
  );
}

function SelectedItemDetails({ item }) {
  return (
    item && (
      <div className={styles.selectedArea}>
        <h3>
          <p className="mb-1">
            <Icon
              path={mdiFileCheckOutline}
              size={1}
              className="mr-1 text-dark"
            />
            <span className="text-overflow">{item.title}</span>
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
        className="bg-light w-100"
      />
    </form>
  );
}

function ItemList({ items, filters, selectedItemId, repoId, collectionId }) {
  const router = useRouter();

  const itemObjects = useMemo(
    () =>
      items
        .filter(
          (i) =>
            !filters.search ||
            (filters.search.toLowerCase() &&
              i.toLowerCase().includes(filters.search))
        )
        .reverse() // newest date first
        .map((i) => parseItemSlugToObject(i)),
    [filters.search, items]
  );

  function onClick(item) {
    router.push(
      item.id === selectedItemId
        ? `/${repoId}/${collectionId}`
        : `/${repoId}/${collectionId}/${item.id}`,
      undefined,
      {
        shallow: true, // only change params in router, not load the page
      }
    ); // if selected already, unselect, otherwise redirect to item page
  }

  return itemObjects.length === 0 ? (
    <p>No items found</p>
  ) : (
    <ul className={styles.listArea}>
      {itemObjects.map((item) => {
        const selected = item.id === selectedItemId;
        return (
          <li key={item.id}>
            <a
              onClick={() => onClick(item)}
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

function parseItemSlugToObject(item) {
  return {
    id: Number(item.substring(0, 10)), // First 10 chars are datetime (id) which helps with uniqueness and sorting (by date)
    title: item.substring(11, item.length).replaceAll("_", " "), // Title comes after id and is separated by underscore. Includes more underscores which were used to replace spaces
  };
}
