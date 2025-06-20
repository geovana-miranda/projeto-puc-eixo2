import styles from "./ModalPropriedades.module.css";

const ModalPropriedades = ({
  abrirModalPropriedades,
  setAbrirModalPropriedades,
  prioridade,
  setPrioridade,
  inicio,
  setInicio,
  final,
  setFinal
}) => {
  return (
    <section className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.espaco}>
          <span>Prioridade</span>
          <select
            className={styles.prioridade}
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className={styles.propriedades && espaco}>
          <div className={styles.espaco}>
            <span>Data de início:</span>
            <input
              type="date"
              className={styles.data}
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </div>

          <div className={styles.espaco}>
            <span>Data de término:</span>
            <input
              type="date"
              className={styles.data}
              value={final}
              onChange={(e) => setFinal(e.target.value)}
            />
          </div>

          <div className={styles.salvar}>
            <button
              className={styles.botaoColorido}
              onClick={() =>
                setAbrirModalPropriedades(!abrirModalPropriedades)
              }
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalPropriedades;
