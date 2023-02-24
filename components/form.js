export function TextInput({ name, value, onChange, className, placeholder }) {
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
    />
  );
}

export function CheckBox({
  name,
  value,
  onChange,
  className,
  label,
  labelClassName,
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
