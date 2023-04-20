import styles from "@/styles/Button.module.scss";

export function Button({
  children,
  onClick,
  className = "",
  loading = false,
  disabled = false,
  type = "", // primary | primaryLight | danger | dangerLight
  size = "", // sm
  ...rest
}) {
  let _className = styles.button;
  if (loading) _className += " " + styles.loading;
  if (type) _className += " " + styles[type];
  if (size) _className += " " + styles[size];
  if (className) _className += " " + className;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={_className}
      {...rest}
    >
      {children}
    </button>
  );
}
