import styles from "./Input.module.css";

interface Props {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, name, type = "text", value, onChange }: Props) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
}
