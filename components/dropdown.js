import { useState, useRef, useEffect } from "react";
import styles from "@/styles/DropDown.module.scss";

export default function DropDown({ handle, children }) {
  const [open, setOpen] = useState(false);
  const delay = useRef(0);

  return (
    <span
      className={styles.dropdown}
      onClick={() => {
        // Otherwise dropdown will be reopened when closed from outsideClick in Content
        if (!open && new Date().getTime() - delay.current > 400) {
          setOpen(true);
        }
      }}
    >
      {handle}
      {open && (
        <Content delay={delay} close={() => setOpen(false)}>
          {children}
        </Content>
      )}
    </span>
  );
}

function Content({ children, delay, close }) {
  const content = useRef(null);
  const [left, setLeft] = useState(0); // absolute left position

  useEffect(() => {
    // after content binded (appeared) push it to left if it overflows out of window to right
    if (content.current && left === 0) {
      const { right } = content.current.getBoundingClientRect();
      if (right > window.outerWidth) {
        setLeft(window.outerWidth - right + "px");
      }
    }
  }, [left]);

  useEffect(() => {
    function onClickOutside(event) {
        debugger;
      if (content.current && !content.current.contains(event.target)) {
        delay.current = new Date().getTime();
        close();
      }
    }

    document.addEventListener("mousedown", onClickOutside); // Bind the event listener
    return () => {
      document.removeEventListener("mousedown", onClickOutside); // Unbind the event listener on clean up
    };
  }, [close, delay]);

  return (
    <div ref={content} className={styles.content} style={{ left }}>
      {children}
    </div>
  );
}
