import styles from "./Lista.module.css";

import { useEffect, useState, useRef, useContext } from "react";
import { MdDeleteForever } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { UsuarioContext } from "../../context/UsuarioContext";
import Tarefa from "../Tarefa/Tarefa";
import ModalAlterarTarefa from "../ModalAlterarTarefa/ModalAlterarTarefa";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";

const Lista = ({ lista, listas, setListas, pessoas }) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);
  const [criarTarefa, setCriarTarefa] = useState(false);
  const [tarefas, setTarefas] = useState([]);

  const [tituloTarefa, setTituloTarefa] = useState("");
  const [prioridade, setPrioridade] = useState("baixa");
  const [descricaoTarefa, setDescricaoTarefa] = useState("");
  const [editarTituloLista, setEditarTituloLista] = useState(lista.titulo);
  const [inputTituloLista, setInputTituloLista] = useState(false);
  const inputRef = useRef(null);

  const [abrirModalAlterarTarefa, setAbrirModalAlterarTarefa] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState("");
  const [dataInicio, setDataInicio] = useState(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  });
  const [dataFinal, setDataFinal] = useState(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  });
  const [membroResponsavel, setMembroResponsavel] = useState([]);
  const [abrirModalConfirmar, setAbrirModalConfirmar] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputTituloLista]);

  useEffect(() => {
    const tarefasLista = lista.tarefas;
    setTarefas(tarefasLista || []);

  }, []);

  const excluirLista = (id) => {
    const listaAtualizada = listas.filter((item) => item.id !== id);
    setListas(listaAtualizada);
  };

  const editandoTituloLista = (id) => {
    const listaAtualizada = listas.map((item) =>
      item.id === id ? { ...item, titulo: editarTituloLista } : item
    );
    setListas(listaAtualizada);
    setInputTituloLista(!inputTituloLista);
  };

  const criandoTarefa = (titulo) => {

    setTarefas([
      ...tarefas,
      {
        id: uuidv4(),
        tarefa: titulo,
        prioridade: prioridade,
        descricao: descricaoTarefa,
        dataInicio: dataInicio,
        dataFinal: dataFinal,
        membroResponsavel: membroResponsavel,
      },
    ]);
  };

  useEffect(() => {
    const atualizandoTarefasLista = listas.map((item) =>
      item.id === lista.id ? { ...item, tarefas: tarefas } : item
    );

    setListas(atualizandoTarefasLista);
  }, [tarefas]);

  return (
    <div className={styles.containerLista}>
      <div className={styles.cabecalhoLista}>
        {inputTituloLista ? (
          <input
            ref={inputRef}
            type="text"
            placeholder="Nome da lista"
            className={styles.inputLista}
            value={editarTituloLista}
            onChange={(e) => setEditarTituloLista(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? editandoTituloLista(lista.id) : ""
            }
          />
        ) : (
          <>
            <h4 className={styles.tituloLista}>{lista.titulo}</h4>
            <div>
              <MdOutlineEdit
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setInputTituloLista(!inputTituloLista);
                }}
              />
              <MdDeleteForever
                style={{ cursor: "pointer" }}
                onClick={() => setAbrirModalConfirmar(true)}
              />
            </div>
            
            {abrirModalConfirmar && (
              <ModalConfirmar
                setAbrirModalConfirmar={setAbrirModalConfirmar}
                excluindo={() => excluirLista(lista.id)}
                nome={lista.titulo}
                objeto="a lista"
              />
            )}

          </>
        )}
      </div>
      <ul>
        {tarefas.length > 0 &&
          tarefas.map((item) => (
            <li className={styles.itemLista} key={item.id}>
              <div className={styles.tarefa}>
                {item.tarefa}

                <div>
                  {item.prioridade === "baixa" && (
                    <GoDotFill className={styles.prioridadeBaixa} />
                  )}
                  {item.prioridade === "media" && (
                    <GoDotFill className={styles.prioridadeMedia} />
                  )}
                  {item.prioridade === "alta" && (
                    <GoDotFill className={styles.prioridadeAlta} />
                  )}

                  <BsThreeDotsVertical
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setAbrirModalAlterarTarefa(!abrirModalAlterarTarefa);
                      setTarefaSelecionada(item);
                    }}
                  />
                </div>
              </div>
              <div className={styles.membros}>
                {usuarios.map((usuario) =>
                  
                  item.membroResponsavel.includes(usuario.id) ? (
                    <img
                      key={usuario.id}
                      src={usuario.imagem}
                      alt={usuario.nome}
                      className={styles.membroResponsavel}
                    />
                  ) : (
                    ""
                  )
                )}
              </div>
            </li>
          ))}
      </ul>

      {abrirModalAlterarTarefa && (
        <ModalAlterarTarefa
          fecharModal={() => setAbrirModalAlterarTarefa(false)}
          setAbrirModalAlterarTarefa={setAbrirModalAlterarTarefa}
          abrirModalAlterarTarefa={abrirModalAlterarTarefa}
          tarefaSelecionada={tarefaSelecionada}
          tarefas={tarefas}
          setTarefas={setTarefas}
          pessoas={pessoas}
          lista={lista}
          listas={listas}
          setListas={setListas}
        />
      )}

      <div onClick={() => setCriarTarefa(true)}>
        <Tarefa
          criarTarefa={criarTarefa}
          tituloTarefa={tituloTarefa}
          setTituloTarefa={setTituloTarefa}
          criandoTarefa={criandoTarefa}
          setCriarTarefa={setCriarTarefa}
          pessoas={pessoas}
        />
      </div>
    </div>
  );
};

export default Lista;
