import styles from "@/styles/SideBar.module.scss";
import { Button } from "../button";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiCheck,
  mdiCogOutline,
  mdiDeleteOutline,
  mdiDotsVertical,
  mdiFolderCheckOutline,
  mdiFolderOutline,
} from "@mdi/js";
import DropDown from "../dropdown";

export function Collections({ repo, selectedCollection, selectCollection }) {
  return (
    <>
      <SelectedCollectionDetails
        repoId={repo.id}
        collection={selectedCollection}
      />
      <CollectionList
        repoId={repo.id}
        data={repo.config.data}
        selectedCollectionId={selectedCollection?.id}
        onSelect={selectCollection}
      />
    </>
  );
}

function SelectedCollectionDetails({ collection, repoId }) {
  return (
    collection && (
      <div className={styles.selectedArea}>
        <h3 title={collection.name}>
          <p className="mb-1">
            <Icon
              path={mdiFolderCheckOutline}
              size={1.15}
              className="mr-1 text-dark"
            />
            <span className="text-overflow">{collection.name}</span>
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
              <Link href={`/${repoId}/${collection.id}/settings`}>
                <Icon path={mdiCogOutline} size={0.7} className="mr-1" />
                Configuration
              </Link>
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

function CollectionList({ repoId, data, selectedCollectionId, onSelect }) {
  return !data ? (
    <>
      <h4 className="mb-3">Incompatible repo!</h4>
      <p className="mt-4">
        See <Link href={`/${repoId}/settings`}>configuration page</Link> of this
        repo for more details.
      </p>
    </>
  ) : data.collections.length === 0 ? (
    <p>No collections found</p>
  ) : (
    <ul className={styles.listArea}>
      {data.collections.map((c) => {
        const selected = c.id === selectedCollectionId;
        return (
          <li key={c.id}>
            <a
              onClick={() => onSelect(selected ? null : c)}
              className={selected ? styles.active : ""}
              href="#"
            >
              <Icon path={mdiFolderOutline} size={0.75} className="mr-1" />
              <span className="text-overflow" title={c.name}>
                {c.name}
              </span>
              {selected && (
                <Icon
                  path={mdiCheck}
                  size={0.75}
                  className="ml-1"
                  title="Selected collection"
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
