import styles from "./ModalAlterarTarefa.module.css";

import { useState, useRef, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";

import ModalPropriedades from "../ModalPropriedades/ModalPropriedades";
import ModalAtribuirTarefa from "../ModalAtribuirTarefa/ModalAtribuirTarefa";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";

const ModalAlterarTarefa = ({
  fecharModal,
  abrirModalAlterarTarefa,
  setAbrirModalAlterarTarefa,
  tarefaSelecionada,
  tarefas,
  setTarefas,
  pessoas,
}) => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const [abrirModalConfirmar, setAbrirModalConfirmar] = useState(false);

  useEffect(() => {
    const clicouFora = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        fecharModal();
      }
    };
    document.addEventListener("mousedown", clicouFora);
    return () => {
      document.removeEventListener("mousedown", clicouFora);
    };
  }, [fecharModal]);

  if (!abrirModalAlterarTarefa) return null;

  const [descricao, setDescricao] = useState(tarefaSelecionada.descricao);
  const [prioridade, setPrioridade] = useState(tarefaSelecionada.prioridade);
  const [inicio, setInicio] = useState(tarefaSelecionada.dataInicio);
  const [final, setFinal] = useState(tarefaSelecionada.dataFinal);
  const [membroAtribuido, setMembroAtribuido] = useState(
    tarefaSelecionada.membroResponsavel
  );
  const [abrirModalPropriedades, setAbrirModalPropriedades] = useState(false);
  const [abrirModalAtribuirTarefa, setAbrirModalAtribuirTarefa] =
    useState(false);

  const [editarTituloTarefa, setEditarTituloTarefa] = useState(
    tarefaSelecionada.tarefa
  );
  const [inputTituloTarefa, setInputTituloTarefa] = useState(false);

  useEffect(() => {
    if (inputTituloTarefa) {
      inputRef.current.focus();
    }
  }, [inputTituloTarefa]);

  const excluirTarefa = () => {
    const tarefasAtualizadas = tarefas.filter(
      (item) => item.id !== tarefaSelecionada.id
    );
    setTarefas(tarefasAtualizadas);
    setAbrirModalAlterarTarefa(!abrirModalAlterarTarefa);
  };

  const alterarTarefa = () => {
    const tarefaAtualizada = tarefas.map((item) =>
      item.id === tarefaSelecionada.id
        ? {
            ...item,
            tarefa: editarTituloTarefa,
            descricao: descricao,
            prioridade: prioridade,
            dataInicio: inicio,
            dataFinal: final,
            membroResponsavel: membroAtribuido,
          }
        : item
    );
    setInputTituloTarefa(!inputTituloTarefa);

    setTarefas(tarefaAtualizada);
    setAbrirModalAlterarTarefa(!abrirModalAlterarTarefa);
  };

  if (abrirModalAlterarTarefa) {
    return (
      <section className={styles.background}>
        <div className={styles.modal} ref={modalRef}>
          <header className={styles.cabecalhoModal}>
            {inputTituloTarefa ? (
              <input
                ref={inputRef}
                type="text"
                className={styles.inputLista}
                value={editarTituloTarefa}
                onChange={(e) => setEditarTituloTarefa(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setInputTituloTarefa(!inputTituloTarefa)
                }
              />
            ) : (
              <>
                <div className={styles.editarTarefa}>
                  <h3>{editarTituloTarefa}</h3>
                  <MdOutlineEdit
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setInputTituloTarefa(!inputTituloTarefa);
                    }}
                  />
                </div>
                <div className={styles.menu}>
                  <h3
                    style={{ cursor: "pointer" }}
                    onClick={() => setAbrirModalPropriedades(true)}
                  >
                    Propriedades
                  </h3>
                  {pessoas.length === 1 && (
                    <h3
                      style={{ color: "#ccc" }}
                      title="Você é o único membro deste quadro no momento"
                    >
                      Atribuir Tarefa
                    </h3>
                  )}

                  {pessoas.length > 1 && (
                    <h3
                      style={{ cursor: "pointer" }}
                      onClick={() => setAbrirModalAtribuirTarefa(true)}
                    >
                      Atribuir Tarefa
                    </h3>
                  )}
                </div>
              </>
            )}
          </header>
          <main className={styles.descricao}>
            <h3>Descrição</h3>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </main>

          <div className={styles.botoes}>
            <button
              className={styles.botao}
              onClick={() => setAbrirModalConfirmar(true)}
            >
              Excluir Tarefa
            </button>
            <button
              className={styles.botaoColorido}
              onClick={() => alterarTarefa()}
            >
              Salvar
            </button>
          </div>

          {abrirModalConfirmar && (
            <ModalConfirmar
              setAbrirModalConfirmar={setAbrirModalConfirmar}
              excluindo={() => excluirTarefa()}
              nome={editarTituloTarefa}
              objeto="o item"
            />
          )}

          {abrirModalPropriedades && (
            <ModalPropriedades
              abrirModalPropriedades={abrirModalPropriedades}
              setAbrirModalPropriedades={setAbrirModalPropriedades}
              prioridade={prioridade}
              setPrioridade={setPrioridade}
              inicio={inicio}
              setInicio={setInicio}
              final={final}
              setFinal={setFinal}
            />
          )}

          {abrirModalAtribuirTarefa && (
            <ModalAtribuirTarefa
              abrirModalAtribuirTarefa={abrirModalAtribuirTarefa}
              setAbrirModalAtribuirTarefa={setAbrirModalAtribuirTarefa}
              pessoas={pessoas}
              membroAtribuido={membroAtribuido}
              setMembroAtribuido={setMembroAtribuido}
            />
          )}
        </div>
      </section>
    );
  } else {
    return <></>;
  }
};

export default ModalAlterarTarefa;
