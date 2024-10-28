import styles from "./ModalCriarQuadro.module.css";
import { useState, useContext, useRef, useEffect } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";

const ModalCriarQuadro = ({
  quadros,
  abrirModalCriar,
  setAbrirModalCriar,
  tituloQuadro,
  setTituloQuadro,
  novoQuadro,
  membros,
  setMembros,
  usuarioAtual,
}) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [emailMembro, setEmailMembro] = useState("");
  const [membrosFiltrados, setMembrosFiltrados] = useState([]);

  const [abrirDropDown, setAbrirDropDrown] = useState(false);
  const [msgErroQuadro, setMsgErroQuadro] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const clicouFora = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setAbrirModalCriar(!abrirModalCriar);
        setTituloQuadro("");
        setMsgErroQuadro("");
        setEmailMembro("");
        setAbrirDropDrown(false);
        setMembros([]);
      }
    };
    document.addEventListener("mousedown", clicouFora);
    return () => {
      document.removeEventListener("mousedown", clicouFora);
    };
  }, [abrirModalCriar]);

  if (!abrirModalCriar) return null;

  const criandoQuadro = () => {
    if (tituloQuadro === "") {
      setMsgErroQuadro("Digite um nome válido");
      return;
    }

    if (quadros.some((item) => tituloQuadro === item.titulo)) {
      setMsgErroQuadro("Já existe um quadro com esse nome");
      return;
    }
    novoQuadro(tituloQuadro, membros);
    setAbrirModalCriar(!abrirModalCriar);
    setMsgErroQuadro("");
    setEmailMembro("");
    setAbrirDropDrown(false);
  };

  const adicionandoMembro = (membro) => {
    if (membro) {
      setMembros((membrosAtuais) => [...membrosAtuais, membro]);
      setEmailMembro("");
      setAbrirDropDrown(false);
    }
  };

  const excluindoMembro = (id) => {
    const membrosAtualizados = membros.filter((item) => item.id !== id);
    setMembros(membrosAtualizados);
  };

  if (abrirModalCriar) {
    return (
      <section className={styles.background}>
        <div className={styles.modal} ref={modalRef}>
          <div className={styles.cabecalhoModal}>
            <h3>Criar Quadro</h3>

            {msgErroQuadro && (
              <div className={styles.msgErro}>
                <p>{msgErroQuadro}</p>
              </div>
            )}

            <img
              src="https://cdn.blablacar.com/wp-content/uploads/br/2024/05/05094506/como-planejar-uma-viagem.webp"
              alt=""
            />
          </div>

          <div className={styles.formulario}>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                <span className={styles.spanModal}>Nome do quadro</span>
                <input
                  onChange={(e) => setTituloQuadro(e.target.value)}
                  value={tituloQuadro}
                  className={styles.inputModal}
                  type="text"
                />
              </label>
            </form>
            <div>
              <span className={styles.spanModal}>Membros</span>
              <input
                className={styles.inputModal}
                type="text"
                placeholder="Convite por e-mail"
                value={emailMembro}
                onChange={(e) => {
                  const emailPesquisa = e.target.value;
                  setEmailMembro(emailPesquisa);
                  let emailsFiltrados;

                  if (emailPesquisa === "") {
                    emailsFiltrados = null;
                  } else {
                    emailsFiltrados = usuarios.filter((usuario) => usuario.id !== usuarioAtual.id &&
                      usuario.email.toLowerCase().startsWith(emailPesquisa.toLowerCase())
                    );                    
                  }
                  setMembrosFiltrados(emailsFiltrados);
                  setAbrirDropDrown(true);
                }}
              />

              {abrirDropDown && membrosFiltrados && (
                <div className={styles.dropdown}>
                  {membrosFiltrados.map((membro) => (
                  <div
                    className={styles.dropdownItem}
                    key={membro.id}
                    onClick={() => adicionandoMembro(membro)}
                  >
                    <img
                      src={membro.imagem}
                      alt={membro.nome}
                      className={styles.avatar}
                    />
                    <span>{membro.email}</span>
                  </div>
                  ))}
                </div>
              )}

              {membros &&
                membros.map((item) => {
                  return (
                    <div key={item.id} className={styles.membros}>
                      <img src={item.imagem} alt="" />
                      <div className={styles.dados}>
                        <span>{item.nome}</span>
                        <span className={styles.email}>{item.email}</span>
                      </div>
                      <span
                        className={styles.remover}
                        onClick={() => excluindoMembro(item.id)}
                      >
                        remover
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className={styles.botoes}>
              <button
                className={styles.botao}
                onClick={() => {
                  setAbrirModalCriar(!abrirModalCriar);
                  setTituloQuadro("");
                  setMsgErroQuadro("");
                  setEmailMembro("");
                  setAbrirDropDrown(false);
                  setMembros([]);
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => criandoQuadro()}
                className={styles.botaoColorido}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return <></>;
  }
};

export default ModalCriarQuadro;
