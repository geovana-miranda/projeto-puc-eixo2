import styles from "./ModalAtribuirTarefa.module.css";

const ModalAtribuirTarefa = ({
  abrirModalAtribuirTarefa,
  setAbrirModalAtribuirTarefa,
  pessoas,
  membroAtribuido,
  setMembroAtribuido,
}) => {
  
  const atribuindoMembro = (idMembro) => {
    if (!membroAtribuido.includes(idMembro)) {
      setMembroAtribuido([...membroAtribuido, idMembro]);
    }
  };

  const removendoMembro = (idMembro) => {
    const novosMembros = membroAtribuido.filter(item => item !== idMembro)
    setMembroAtribuido(novosMembros)
  }

  return (
    <section className={styles.background}>
      <div className={styles.modal}>
        <ul className={styles.lista}>
          {pessoas.map((pessoa) => {
            const checado = membroAtribuido.some((item) => item === pessoa.id);

            const atribuicao = (e) => {
              const {checked, value} = e.target;
              if (checked) {
                atribuindoMembro(value)
              } else {
                removendoMembro(value)
              }
            }

            return (
              <li className={styles.itemLista} key={pessoa.id}>
                <img src={pessoa.imagem} alt={pessoa.nome} />
                <span>{pessoa.nome}</span>
              
                <input
                  type="checkbox"
                  value={pessoa.id}
                  checked={checado}
                  onChange={atribuicao}
                />
              </li>
            );
          })}
        </ul>

        <div className={styles.salvar}>
          <button
            className={styles.botaoColorido}
            onClick={() =>
              setAbrirModalAtribuirTarefa(!abrirModalAtribuirTarefa)
            }
          >
            Salvar
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalAtribuirTarefa;
