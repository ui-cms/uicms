import { useState, useRef, useEffect } from "react";
import styles from "@/styles/DropDown.module.scss";

export default function DropDown({ handle, children, direction = "left" }) {
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
        <Content
          delay={delay}
          direction={direction}
          close={() => setOpen(false)}
        >
          {children}
        </Content>
      )}
    </span>
  );
}

function Content({ children, delay, close, direction }) {
  const content = useRef(null);
  const [side, setSide] = useState(0); // absolute left|right position

  useEffect(() => {
    // after content binded (appeared) push it to left (right) if it overflows out of window to right (left)
    if (content.current && side === 0) {
      const { right, left } = content.current.getBoundingClientRect();
      if (direction === "left" && right > window.outerWidth) {
        setSide(window.outerWidth - right + "px");
      } else if (direction === "right" && left < 0) {
        setSide(0 - left + "px");
      }
    }
  }, [direction, side]);

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
    <div ref={content} className={styles.content} style={{ [direction]: side }}>
      {children}
    </div>
  );
}
