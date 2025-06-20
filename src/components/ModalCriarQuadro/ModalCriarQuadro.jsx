import styles from "./ModalCriarQuadro.module.css";
import imagemPadrao from "../../assets/imgpadrao.png";

import { useState, useContext, useRef, useEffect } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { GoPencil } from "react-icons/go";
import { v4 as uuidv4 } from "uuid";

const ModalCriarQuadro = ({
  quadros,
  abrirModalCriar,
  setAbrirModalCriar,
  usuarioAtual,
  setUsuarioAtual,
}) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [tituloQuadro, setTituloQuadro] = useState("");
  const [imagemQuadro, setImagemQuadro] = useState(imagemPadrao);
  const [nomeImagem, setNomeImagem] = useState("");
  const [membros, setMembros] = useState([]);

  const [emailMembro, setEmailMembro] = useState("");
  const [membrosFiltrados, setMembrosFiltrados] = useState([]);

  const [abrirDropDown, setAbrirDropDrown] = useState(false);
  const [msgErroQuadro, setMsgErroQuadro] = useState("");
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const inputImagemRef = useRef(null);

  useEffect(() => {
    if (abrirModalCriar && inputRef.current) {
      inputRef.current.focus();
    }

    const clicouFora = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setAbrirModalCriar(!abrirModalCriar);
        setTituloQuadro("");
        setMsgErroQuadro("");
        setEmailMembro("");
        setImagemQuadro(imagemPadrao);
        setNomeImagem("");
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

  const criarQuadro = (tituloQuadro, membros, imagemQuadro, nomeImagem) => {
    const quadroCriado = {
      titulo: tituloQuadro,
      id: uuidv4(),
      admin: usuarioAtual.id,
      membros: membros.map((item) => item.id),
      imagem: imagemQuadro,
      nomeImagem: nomeImagem,
    };

    const quadrosAtualizadosUsuario = [...quadros, quadroCriado];

    const usuariosAtualizados = usuarios.map((item) => {
      if (item.id === usuarioAtual.id) {
        return { ...item, quadros: quadrosAtualizadosUsuario };
      }

      const membrosAtualizados = membros.some(
        (membro) => item.id === membro.id
      );
      if (membrosAtualizados) {
        return {
          ...item,
          quadros: [...(item.quadros || []), quadroCriado],
        };
      }

      return item;
    });

    localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));

    setUsuarioAtual((usuarioAtual) => ({
      ...usuarioAtual,
      quadros: quadrosAtualizadosUsuario,
    }));

    setUsuarios(usuariosAtualizados);

    setTituloQuadro("");
    setMembros([]);
  };

  const criandoQuadro = () => {
    if (tituloQuadro === "") {
      setMsgErroQuadro("Digite um nome válido");
      return;
    }

    if (quadros.some((item) => tituloQuadro === item.titulo)) {
      setMsgErroQuadro("Já existe um quadro com esse nome");
      return;
    }

    criarQuadro(tituloQuadro, membros, imagemQuadro, nomeImagem);

    setAbrirModalCriar(!abrirModalCriar);
    setMsgErroQuadro("");
    setTituloQuadro("");
    setMembros([]);
    setEmailMembro("");
    setImagemQuadro(imagemPadrao);
    setNomeImagem("");
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

  const carregarImagemQuadro = (e) => {
    const arquivo = e.target.files[0];

    if (arquivo) {
      setNomeImagem(arquivo.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
          setImagemQuadro(dataUrl);
          setNomeImagem();
        };
      };
      reader.readAsDataURL(arquivo);
    }
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

            <div className={styles.containerImagem}>
              {imagemQuadro ? (
                <img src={imagemQuadro} alt={nomeImagem} />
              ) : (
                <img src={imagemPadrao} alt="imagem padrão de quadro" />
              )}

              <div className={styles.overlay}>
                <button onClick={() => inputImagemRef.current.click()}>
                  <GoPencil />
                  <span>Alterar imagem</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputImagemRef}
                  onChange={carregarImagemQuadro}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formulario}>
            <form onSubmit={(e) => e.preventDefault()} className={styles.espaco}>
              <label className={styles.espaco}>
                <span className={styles.spanModal}>Nome do quadro</span>
                <input
                  ref={inputRef}
                  onChange={(e) => setTituloQuadro(e.target.value)}
                  value={tituloQuadro}
                  className={styles.inputModal}
                  type="text"
                />
              </label>
            </form>
            <div className={styles.espaco}>
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
                    emailsFiltrados = usuarios.filter(
                      (usuario) =>
                        usuario.id !== usuarioAtual.id &&
                        usuario.email
                          .toLowerCase()
                          .startsWith(emailPesquisa.toLowerCase())
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
                  setImagemQuadro(imagemPadrao);
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
