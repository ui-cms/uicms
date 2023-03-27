import { useState } from "react";
import styles from "@/styles/Tabs.module.scss";
import { Button } from "./button";

export default function Tabs({
  className = "",
  tabs, // e.g [{title: "", content:  jsx, disabled=false, loading}]
  prerender = false, // when true will render all tabs' contents and will hide/show them when requested, otherwise will only render when requested
  onTabClick, // callback to pass clicked tabs's index
}) {
  const [active, setActive] = useState(0); // index

  function onClick(index) {
    setActive(index);
    onTabClick && onTabClick(index);
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
                onClick={() => onClick(index)}
                disabled={tab.disabled}
                loading={tab.loading}
              >
                {tab.title}
              </Button>
            );
          })}
        </div>

        {prerender ? (
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
