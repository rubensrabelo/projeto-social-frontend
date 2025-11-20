import styles from "./Input.module.css";

interface Props {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, name, type = "text", value, onChange }: Props) {
  const id = `${name}-input`;

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
}
