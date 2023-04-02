import { useMemo, useState, useRef } from "react";
import styles from "@/styles/Tooltip.module.scss";

export default function Tooltip({ children, content, className }) {
  const [rect, setRect] = useState({});
  const [contentRect, setContentRect] = useState({});
  const contentRef = useRef();

  const position = useMemo(() => {
    if (typeof window !== "undefined") {
      let left = rect.left;
      let top = rect.top;
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 10 + "px";
      }
      if (top + contentRect.height > window.innerHeight) {
        top = window.innerHeight - contentRect.height - 10 + "px";
      }
      return {
        top,
        left,
      };
    }
  }, [rect.left, rect.top, contentRect.height, contentRect.width]);

  function onHover(e) {
    if (e.currentTarget && contentRef.current) {
      setRect(e.currentTarget.getBoundingClientRect());
      setContentRect(contentRef.current.getBoundingClientRect());
    }
  }

  return (
    <div
      className={`${styles.tooltip} ${className || ""}`}
      onMouseOver={onHover}
    >
      {children || <span>&#8505;</span>}
      <div className={styles.content} ref={contentRef} style={position}>
        {content}
      </div>
    </div>
  );
}
