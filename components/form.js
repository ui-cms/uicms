import styles from "@/styles/Form.module.scss";

export function TextInput({ name, value, onChange, className = "", ...rest }) {
  function change(e) {
    if (!e || !e.target) return null;
    const { name, value } = e.target;
    onChange({ name, value });
  }

  return (
    <input
      name={name}
      value={value}
      onChange={change}
      type="text"
      className={`${styles.textInput} ${className}`}
      autoComplete="off"
      {...rest}
    />
  );
}

export function CheckBox({ children, name, value, onChange, className = "" }) {
  function change(e) {
    if (!e || !e.target) return null;
    const { name, checked } = e.target;
    onChange({ name, value: checked });
  }

  return (
    <label className={`${styles.checkbox} ${className}`}>
      <input name={name} checked={value} onChange={change} type="checkbox" />
      {children}
    </label>
  );
}

export function Select({ children, name, value, onChange, className = "" }) {
  function change(e) {
    if (!e || !e.target) return null;
    const { name, value } = e.target;
    onChange({ name, value });
  }

  return (
    <select
      value={value}
      onChange={change}
      name={name}
      className={`${styles.select} ${className}`}
      autoComplete="off"
    >
      {children}
    </select>
  );
}
