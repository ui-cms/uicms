import { useState } from "react";
import styles from "@/styles/Tabs.module.scss";

// <Tabs tabs={[{title: "", content:  jsx}]} />
export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0); // index
  return (
    tabs.length > 0 && (
      <>
        <div className={styles.tabs}>
          {tabs.map((tab, index) => {
            return (
              <button
                key={index}
                className={index === active ? styles.active : ""}
                onClick={() => setActive(index)}
              >
                {tab.title}
              </button>
            );
          })}
        </div>
        <div className={styles.content}>{tabs[active].content}</div>
      </>
    )
  );
}
