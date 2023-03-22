import { useState } from "react";
import styles from "@/styles/Tabs.module.scss";
import { Button } from "./button";

// <Tabs tabs={[{title: "", content:  jsx, disabled=false, loading}]} />
export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0); // index
  return (
    tabs.length > 0 && (
      <div>
        <div className={styles.tabs}>
          {tabs.map((tab, index) => {
            return (
              <Button
                key={index}
                className={index === active ? styles.active : ""}
                onClick={() => setActive(index)}
                disabled={tab.disabled}
                loading={tab.loading}
              >
                {tab.title}
              </Button>
            );
          })}
        </div>

        {tabs.map((tab, index) => {
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
        })}
      </div>
    )
  );
}
