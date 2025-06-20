import styles from "./MinhaConta.module.css";

import { useLocation } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";

import Cabecalho from "../../components/Cabecalho/Cabecalho";
import Msg from "../../components/Formulario/Msg/Msg";

import { useContext, useState, useRef, useEffect } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { GoPencil } from "react-icons/go";

const MinhaConta = () => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const inputRef = useRef(null);
  const location = useLocation();
  const idUsuario = location.state;
  const usuarioAtual = usuarios.find((usuario) => usuario.id === idUsuario);
  const inputImagemRef = useRef(null);

  const [nomeAlterar, setNomeAlterar] = useState(usuarioAtual.nome);
  const [emailAlterar, setEmailAlterar] = useState(usuarioAtual.email);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [imagemAlterar, setImagemAlterar] = useState(usuarioAtual.imagem);
  const [desabilitado, setDesabilitado] = useState(true);
  const [adicionandoUsuario, setAdicionandoUsuario] = useState(false);
  const [editandoNome, setEditandoNome] = useState(false);
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [editandoFoto, setEditandoFoto] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (adicionandoUsuario) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      setAdicionandoUsuario(false);
    }
  }, [adicionandoUsuario]);

  const atualizarUsuario = (atualizacoes) => {
    const usuarioAlterado = { ...usuarioAtual, ...atualizacoes };
    const usuariosAtualizados = usuarios.map((usuario) =>
      usuario.id === idUsuario ? usuarioAlterado : usuario
    );
    setUsuarios(usuariosAtualizados);
    setAdicionandoUsuario(true);
    return usuarioAlterado;
  };

  const alterarDado = (dado) => {
    switch (dado) {
      
      case "nome":
        if (nomeAlterar == "") {          
          cancelar("nome");
        } else {
        atualizarUsuario({ nome: nomeAlterar });
        setMsg({ mensagem: "Novo nome salvo com sucesso.", cor: "verde" });
        setEditandoNome(false);
        }
        break;
      case "email":
        if (emailAlterar == "") {          
          cancelar("email");
        } else {
        atualizarUsuario({ email: emailAlterar });
        setMsg({ mensagem: "Novo email salvo com sucesso.", cor: "verde" });
        setEditandoEmail(false);
        }
        break;
      case "senha":
        if (!senhaAtual || !senhaNova) {
          setMsg({ mensagem: "Preencha os campos de senhas corretamente", cor: "vermelho" });
          return;
        }
        if (usuarioAtual.senha !== senhaAtual) {
          setMsg({ mensagem: "Ops! Parece que a senha atual está incorreta", cor: "vermelho" });
          return;
        }
        if (senhaNova === usuarioAtual.senha) {
          setMsg({ mensagem: "A nova senha deve ser diferente da senha atual.", cor: "vermelho" });
          return;
        }
        atualizarUsuario({ senha: senhaNova });
        setMsg({ mensagem: "Nova senha salva com sucesso.", cor: "verde" });
        setSenhaAtual("");
        setSenhaNova("");
        setEditandoSenha(false);
        break;
      case "foto":
        atualizarUsuario({ imagem: imagemAlterar });
        setMsg({ mensagem: "Nova foto salva com sucesso.", cor: "verde" });
        setEditandoFoto(false);
        break;
      default:
        break;
    }
  };
  
  const editarDado = (dado) => {
    setMsg("");

    if (dado === "nome") {
      setEditandoNome(true);
    } else if (dado === "email") {
      setEditandoEmail(true);
    } else if (dado === "senha") {
      setEditandoSenha(true);
    } else if (dado === "foto") {
      setEditandoFoto(true);
    }
  };

  const cancelar = (dado) => {
    if (dado === "nome") {
      setNomeAlterar(usuarioAtual.nome);
      setEditandoNome(false);
    } else if (dado === "email") {
      setEmailAlterar(usuarioAtual.email);
      setEditandoEmail(false);
    } else if (dado === "senha") {
      setSenhaAtual("");
      setSenhaNova("");
      setEditandoSenha(false);
    } else if (dado === "foto") {
      setImagemAlterar(usuarioAtual.imagem);
      setEditandoFoto(false);
    }
    setMsg("");
  };

  const carregarImagemPerfil = (e) => {
    const arquivo = e.target.files[0];

    if (arquivo) {
      setImagemAlterar(arquivo.name);

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
          setImagemAlterar(dataUrl);
        };
      };
      reader.readAsDataURL(arquivo);
    }

    editarDado("foto");
  };

  return (
    <div className={styles.body}>
      <Cabecalho idUsuario={idUsuario} />

      <section className={styles.container}>
        <h2>Minha conta</h2>
        <div className={styles.msg}>
          {msg && <Msg mensagem={msg} />}

        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.formulario}
        >

          <label htmlFor="foto" className={styles.foto}>
            <span>Foto de perfil</span>
            <div className={styles.containerImagem}>
              <img src={imagemAlterar} />

              <div className={styles.overlay}>
                <button onClick={() => inputImagemRef.current.click()}>
                  <GoPencil />
                  <span>Alterar</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputImagemRef}
                  onChange={carregarImagemPerfil}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {editandoFoto && (
              <div className={styles.botoes}>
                <button
                  className={styles.botaoSalvar}
                  onClick={() => alterarDado("foto")}
                >
                  Salvar
                </button>
                <button
                  className={styles.botaoCancelar}
                  onClick={() => cancelar("foto")}
                >
                  Cancelar
                </button>
              </div>
            )}
          </label>

          <label className={styles.label} htmlFor="nome">
            <div>
              <span>Nome</span>
              {!editandoNome && (
                <MdOutlineModeEdit
                  onClick={() => editarDado("nome")}
                  className={styles.icone}
                />
              )}
            </div>

            {!editandoNome ? (
              <input
                name="nome"
                type="text"
                placeholder={nomeAlterar}
                className={styles.desabilitado}
                disabled={desabilitado}
              />
            ) : (
              <div className={styles.editar}>
                <input
                  name="nome"
                  type="text"
                  value={nomeAlterar}
                  onChange={(e) => setNomeAlterar(e.target.value)}
                />
                <div className={styles.botoes}>
                  <button
                    className={styles.botaoSalvar}
                    onClick={() => alterarDado("nome")}
                  >
                    Salvar
                  </button>
                  <button
                    className={styles.botaoCancelar}
                    onClick={() => cancelar("nome")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </label>

          <label className={styles.label} htmlFor="email">
            <div>
              <span>Email</span>
              {!editandoEmail && (
                <MdOutlineModeEdit
                  onClick={() => editarDado("email")}
                  className={styles.icone}
                />
              )}
            </div>

            {!editandoEmail ? (
              <input
                name="email"
                type="email"
                placeholder={emailAlterar}
                className={styles.desabilitado}
                disabled={desabilitado}
              />
            ) : (
              <div className={styles.editar}>
                <input
                  name="email"
                  type="text"
                  value={emailAlterar}
                  onChange={(e) => setEmailAlterar(e.target.value)}
                />
                <div className={styles.botoes}>
                  <button
                    className={styles.botaoSalvar}
                    onClick={() => alterarDado("email")}
                  >
                    Salvar
                  </button>
                  <button
                    className={styles.botaoCancelar}
                    onClick={() => cancelar("email")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </label>

          <label className={styles.label} htmlFor="senha">
            {!editandoSenha && (
              <div>
                <span>Senha</span>
                <MdOutlineModeEdit
                  onClick={() => editarDado("senha")}
                  className={styles.icone}
                />
              </div>
            )}

            {!editandoSenha ? (
              <input
                name="senha"
                type="password"
                defaultValue={usuarioAtual.senha}
                className={styles.desabilitado}
                disabled={desabilitado}
              />
            ) : (
              <div className={styles.editar}>
                <div>
                  <label className={styles.label} htmlFor="senhaAtual">
                    <span>Senha Atual</span>
                    <input
                      name="senhaAtual"
                      type="password"
                      autoComplete="off"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </label>

                  <div className={styles.editar}>
                    <label className={styles.label} htmlFor="novaSenha">
                      <span>Nova senha</span>
                      <input
                        name="novaSenha"
                        type="password"
                        value={senhaNova}
                        onChange={(e) => setSenhaNova(e.target.value)}
                      />
                    </label>
                    <div className={styles.botoes}>
                      <button
                        className={styles.botaoSalvar}
                        onClick={() => alterarDado("senha")}
                      >
                        Salvar
                      </button>
                      <button
                        className={styles.botaoCancelar}
                        onClick={() => cancelar("senha")}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </label>
        </form>
      </section>
    </div>
  );
};

export default MinhaConta;
