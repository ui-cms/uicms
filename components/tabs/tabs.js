import { useState } from "react";
import styles from "./Tabs.module.scss";

// <Tabs tabs={[{title: "", content:  jsx}]} />
export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0); // index
  return (
    tabs.length > 0 && (
      <div>
        <ul className={styles.tabs}>
          {tabs.map((tab, index) => {
            return (
              <li
                key={index}
                className={index === active ? styles.active : ""}
                onClick={() => setActive(index)}
              >
                {tab.title}
              </li>
            );
          })}
        </ul>
        {tabs[active].content}
      </div>
    )
  );
}
