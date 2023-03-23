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

  useEffect(() => {
    function onClickOutside(event) {
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
    <div ref={content} className={styles.content}>
      {children}
    </div>
  );
}
