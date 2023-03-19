import styles from "@/styles/Button.module.scss";

export function Button({
  children,
  onClick,
  className = "",
  loading = false,
  disabled = false,
  type = "", // primary | primaryLight | danger | dangerLight
}) {
  let _className = styles.button;
  if (loading) _className += " " + styles.loading;
  if (type) _className += " " + styles[type];
  if (className) _className += " " + className;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={_className}
    >
      {children}
    </button>
  );
}
