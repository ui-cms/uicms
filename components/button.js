import styles from "@/styles/Button.module.scss";

export function Button({ children, className = "", loading = false, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${styles.button} ${className}`}
    >
      <span className={styles.children}>{children}</span>
      {loading && <span className={styles.loader}></span>}
    </button>
  );
}
