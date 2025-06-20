import styles from "./Input.module.css";

const Input = ({ label, type, placeholder, valor, setValor }) => {
  return (
    <div className={styles.campoFormulario}>
      <label className={styles.label}>
        <span>{label}</span>
        <input
          type={type}
          required
          name={label}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </label>
    </div>
  );
};

export default Input;
