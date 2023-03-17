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
      className={className}
      placeholder={placeholder}
      autoComplete="off"
    />
  );
}

export function CheckBox({ name, value, onChange, className = "", label }) {
  function change(e) {
    if (!e || !e.target) return null;
    const { name, checked } = e.target;
    onChange({ name, value: checked });
  }

  return (
    <label className={className}>
      <input name={name} checked={value} onChange={change} type="checkbox" />
      {label}
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
      autoComplete="off"
    >
      {children}
    </select>
  );
}
