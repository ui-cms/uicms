import Link from "next/link";
import { useState } from "react";

// tabs with onClick: [{text: "my tab", onClick: ()=>()}]
// tabs with href:    [{text: "my tab", href: "https://google.com"}]
export default function TitleWithTab({ title, subtitle, tabs = [], className="" }) {
  const [activeTab, setActiveTab] = useState(0); // index

  return (
    <div
      className={`is-flex mb-2 flex-dir-col-sm ${className}`}
      style={{ borderBottom: "1px solid hsl(0, 0%, 86%)" }}
    >
      {title && (
        <div className="is-align-self-center width-100-sm">
          <p className="title is-4 pr-6 is-text-overflow">{title}</p>
        </div>
      )}
      {subtitle && (
        <div className="is-align-self-center width-100">
          <p className="subtitle is-5 has-text-grey">{subtitle}</p>
        </div>
      )}
      {tabs.length > 0 && (
        <div className="mt-3-sm">
          <div className="tabs" style={{ marginBottom: "-1px" }}>
            <ul>
              {tabs.map((tab, index) => {
                return (
                  <li
                    key={index}
                    className={activeTab === index ? "is-active" : ""}
                  >
                    {tab.href ? (
                      <Link
                        href={tab.href}
                        target="_blank"
                      >
                        {tab.text}
                      </Link>
                    ) : (
                      <a
                        onClick={() => {
                          setActiveTab(index);
                          tab.onClick();
                        }}
                      >
                        {tab.text}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
