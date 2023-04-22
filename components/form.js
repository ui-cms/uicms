import styles from "@/styles/Form.module.scss";

export function TextInput({
  name,
  value,
  onChange,
  className = "",
  max,
  regex, // use regex to filter unwanted chars in value. If passing valid chars, make sure to negate regex with ^ symbol. E.g /[^a-zA-Z0-9]+/g will cause all non alphanumeric to be removed
  ...rest
}) {
  function change(e) {
    if (!e || !e.target) return null;
    let { name, value } = e.target;

    if (max && value.length > max) return;
    if (regex) value = value.replace(regex, "");

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

export function Select({
  children,
  name,
  value,
  onChange,
  className = "",
  disabled = false,
  ...rest
}) {
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
      disabled={disabled}
      {...rest}
    >
      {children}
    </select>
  );
}
