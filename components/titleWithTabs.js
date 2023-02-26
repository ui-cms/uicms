import Link from "next/link";
import { useState } from "react";

// tab with content: [{text: "my component", icon: <Icon/>, content: jsx]
// tab with onClick: [{text: "open popup", icon: <Icon/>, onClick: ()=>()}]
// tab with href:    [{text: "view website", icon: <Icon/>, href: "https://google.com"}]
export default function TitleWithTabs({
  title,
  subtitle,
  tabs = [],
  className = "",
  defaultTab = 0,
}) {
  const [activeTab, setActiveTab] = useState(defaultTab); // index

  return (
    tabs.length > 0 && (
      <>
        <div
          className={`is-flex flex-dir-col-sm ${className}`}
          style={{ borderBottom: "1px solid hsl(0, 0%, 86%)" }}
        >
          {title && (
            <div className="is-align-self-center width-100-sm">
              <p className="title is-4 pr-6 is-text-overflow">{title}</p>
            </div>
          )}
          {subtitle && (
            <div className="is-align-self-center width-100">
              <p className="subtitle is-5 is-text-overflow">{subtitle}</p>
            </div>
          )}
          {tabs.length > 0 && (
            <div className="mt-3-sm">
              <div className="tabs" style={{ marginBottom: "-1px" }}>
                <ul>
                  {tabs.map((tab, index) => {
                    const icon = tab.icon && (
                      <span className="icon is-small" style={{ marginLeft: 0 }}>
                        {tab.icon}
                      </span>
                    );
                    return (
                      <li
                        key={index}
                        className={activeTab === index ? "is-active" : ""}
                      >
                        {tab.href ? (
                          <Link href={tab.href} target="_blank">
                            {icon}
                            {tab.text}
                          </Link>
                        ) : (
                          <a
                            onClick={() =>
                              tab.content ? setActiveTab(index) : tab.onClick()
                            }
                          >
                            {icon}
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
        {tabs[activeTab].content}
      </>
    )
  );
}
