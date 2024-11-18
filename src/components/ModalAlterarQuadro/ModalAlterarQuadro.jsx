import styles from "../ModalCriarQuadro/ModalCriarQuadro.module.css";

import { useState, useContext, useRef, useEffect } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { GoPencil } from "react-icons/go";

import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";

const ModalAlterarQuadro = ({
  quadros,
  abrirModalAlterar,
  setAbrirModalAlterar,
  quadroSelecionado,
  excluirQuadro,
  alterarQuadro,
  usuarioAtual,
}) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [titulo, setTitulo] = useState(quadroSelecionado.titulo);
  const [imagemQuadro, setImagemQuadro] = useState(quadroSelecionado.imagem);
  const [nomeImagem, setNomeImagem] = useState(quadroSelecionado.nomeImagem);
  const [emailMembro, setEmailMembro] = useState("");
  const [membrosFiltrados, setMembrosFiltrados] = useState([]);

  const [msgErroAlterarQuadro, setMsgErroAlterarQuadro] = useState("");
  const [abrirDropDown, setAbrirDropDrown] = useState(false);
  const [abrirModalConfirmar, setAbrirModalConfirmar] = useState(false);
  const [idMembrosQuadro, setIdMembrosQuadro] = useState(
    quadroSelecionado.membros || []
  );

  const membrosQuadro = usuarios.filter((usuario) =>
    idMembrosQuadro.find((item) => item === usuario.id) ? usuario : ""
  );

  const modalRef = useRef(null);
  const inputImagemRef = useRef(null);

  useEffect(() => {
    const clicouFora = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setAbrirModalAlterar(!abrirModalAlterar);
      }
    };
    document.addEventListener("mousedown", clicouFora);
    return () => {
      document.removeEventListener("mousedown", clicouFora);
    };
  }, [abrirModalAlterar]);

  if (!abrirModalAlterar) return null;

  const adicionandoMembro = (membro) => {
    if (membro) {
      setIdMembrosQuadro((membrosAtuais) => [...membrosAtuais, membro.id]);
      setEmailMembro("");
      setAbrirDropDrown(false);
    }
  };

  const excluindoMembro = (id) => {
    const membrosAtualizados = idMembrosQuadro.filter((item) => item !== id);
    setIdMembrosQuadro(membrosAtualizados);
  };

  const alterandoQuadro = () => {
    if (titulo === "") {
      setMsgErroAlterarQuadro("Digite um título válido");
      return;
    }

    if (
      quadros.some(
        (item) => titulo === item.titulo && item.id !== quadroSelecionado.id
      )
    ) {
      setMsgErroAlterarQuadro("Esse quadro já existe");
      return;
    }

    alterarQuadro(
      quadroSelecionado,
      titulo,
      idMembrosQuadro,
      imagemQuadro,
      nomeImagem
    );
    setAbrirModalAlterar(!abrirModalAlterar);
    setMsgErroAlterarQuadro("");
  };

  const excluindoQuadro = () => {
    excluirQuadro(quadroSelecionado.id);
    setAbrirModalAlterar(!abrirModalAlterar);
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
          setNomeImagem()
        };

      };
      
      reader.readAsDataURL(arquivo);
    }
  };

  if (abrirModalAlterar) {
    return (
      <section className={styles.background}>
        <div className={styles.modal} ref={modalRef}>
          <div className={styles.cabecalhoModal}>
            <h3>Alterar Quadro</h3>

            {msgErroAlterarQuadro && (
              <div className={styles.msgErro}>
                <p>{msgErroAlterarQuadro}</p>
              </div>
            )}

            <div className={styles.containerImagem}>

              <img src={imagemQuadro} alt={nomeImagem} />

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
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
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
                        !idMembrosQuadro.includes(usuario.id) &&
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
                      key={membro.id}
                      className={styles.dropdownItem}
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

              {membrosQuadro &&
                membrosQuadro.map((item) => {
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

            <div className={styles.botoes} >
              <button
                className={styles.botao}
                onClick={() => setAbrirModalConfirmar(true)}
              >
                Excluir Quadro
              </button>
              <button
                onClick={() => alterandoQuadro()}
                className={styles.botaoColorido}
              >
                Salvar
              </button>

              {abrirModalConfirmar && (
                <ModalConfirmar
                  setAbrirModalConfirmar={setAbrirModalConfirmar}
                  excluindo={excluindoQuadro}
                  nome={titulo}
                  objeto="o quadro"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return <></>;
  }
};

export default ModalAlterarQuadro;
