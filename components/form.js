export function TextInput({
  name,
  value,
  onChange,
  className = "",
  placeholder,
}) {
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
      className={`has-background-white-bis ${className}`}
      placeholder={placeholder}
      autoComplete={false}
    />
  );
}

export function CheckBox({
  name,
  value,
  onChange,
  className = "",
  label,
  labelClassName = "",
}) {
  function change(e) {
    if (!e || !e.target) return null;
    const { name, checked } = e.target;
    onChange({ name, value: checked });
  }

  return (
    <label className={`checkbox ${labelClassName || ""}`}>
      <input
        name={name}
        checked={value}
        onChange={change}
        type="checkbox"
        className={className}
      />
      &nbsp;{label}
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
      className={className}
      autoComplete={false}
    >
      {children}
    </select>
  );
}
