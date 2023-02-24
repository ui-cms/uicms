import { useState } from "react";

// e.g items:[{title: "", content:  jsx}]
export default function Tabs({ className, items }) {
  const [active, setActive] = useState(0); // index
  return (
    items.length > 0 && (
      <>
        <div className={`tabs ${className || ""}`}>
          <ul>
            {items.map((tab, index) => {
              return (
                <li key={index} className={index === active ? "is-active" : ""}>
                  <a onClick={() => setActive(index)}>{tab.title}</a>
                </li>
              );
            })}
          </ul>
        </div>
        {items[active].content}
      </>
    )
  );
}
