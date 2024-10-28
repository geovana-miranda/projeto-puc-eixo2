import styles from "./ModalConfirmar.module.css";

const ModalConfirmar = ({
  setAbrirModalConfirmar,
  excluindo,
  nome,
  objeto
}) => {
  return (
    <>
      <section className={styles.background}>
        <div className={styles.modal}>
          <h3>
            Atenção: esta ação excluirá permanentemente {objeto} "{nome}".
          </h3>
          <h3>Deseja continuar? </h3>
          <div className={styles.botoes}>
            <button
              className={styles.botao}
              onClick={() => setAbrirModalConfirmar(false)}
            >
              Não
            </button>
            <button
              onClick={() => excluindo()}
              className={styles.botaoColorido}
            >
              Sim
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModalConfirmar;
