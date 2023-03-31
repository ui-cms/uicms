import { useState } from "react";
import styles from "@/styles/Tabs.module.scss";
import { Button } from "./button";
import Loader from "./loader";

export default function Tabs({
  className = "",
  tabs, // e.g [{title: "", content: jsx, disabled: false, onClick: func}]
  prerender = false, // when true will render all tabs' contents and will hide/show them when requested, otherwise will only render when requested
  tabClickCallback, // callback to pass clicked tabs's index
  loading = false,
}) {
  const [active, setActive] = useState(0); // index

  function onTabClick(index, onClick) {
    setActive(index);
    tabClickCallback && tabClickCallback(index);
    onClick && onClick();
  }

  return (
    tabs.length > 0 && (
      <div className={className}>
        <div className={styles.tabs}>
          {tabs.map((tab, index) => {
            return (
              <Button
                key={index}
                className={index === active ? styles.active : ""}
                onClick={() => onTabClick(index, tab.onClick)}
                disabled={tab.disabled}
              >
                {tab.title}
              </Button>
            );
          })}
        </div>

        {loading ? (
          <Loader />
        ) : prerender ? (
          tabs.map((tab, index) => {
            return (
              <div
                key={index}
                className={`${styles.content} ${
                  index === active ? "d-block" : "d-none"
                }`}
              >
                {tab.content}
              </div>
            );
          })
        ) : (
          <div className={styles.content}>{tabs[active].content}</div>
        )}
      </div>
    )
  );
}
