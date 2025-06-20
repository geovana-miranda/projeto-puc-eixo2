import styles from "./Cadastro.module.css";
import logo from "../../assets/logo.png";

import { useState, useContext, useEffect } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { v4 as uuidv4 } from "uuid";

import FormularioCriarConta from "../../components/Formulario/FormularioCriarConta";
import FormularioLogar from "../../components/Formulario/FormularioLogar";

const Cadastro = () => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [nomeBotao, setNomeBotao] = useState("Não possui conta?");
  const [formLogar, setformLogar] = useState(true);
  const [adicionandoUsuario, setAdicionandoUsuario] = useState(false);

  useEffect(() => {
    const usuariosSalvos = localStorage.getItem("usuarios");

    if (usuariosSalvos) {
      setUsuarios(JSON.parse(usuariosSalvos));
    } else {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  }, []);

  const novoUsuario = (usuario) => {
    setUsuarios([...usuarios, { ...usuario, id: uuidv4() }]);
    setAdicionandoUsuario(true);
  };

  useEffect(() => {
    if (adicionandoUsuario) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      setAdicionandoUsuario(false);
    }
  }, [adicionandoUsuario]);

  const paginaLogar = () => {
    setformLogar(!formLogar);
    !formLogar
      ? setNomeBotao("Não possui conta?")
      : setNomeBotao("Já possui conta?");
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="logo da gestio" />
          <h1>GESTIO</h1>
        </div>

        <div className={styles.texto}>
          <h2>Simplifique suas tarefas, potencialize seus resultados.</h2>
        </div>

        <div>
          <button onClick={() => paginaLogar()} className={styles.botao}>
            {nomeBotao}
          </button>
        </div>

        {!formLogar && (
          <FormularioCriarConta
            cadastrarUsuario={(usuario) => novoUsuario(usuario)}
          />
        )}

        {formLogar && <FormularioLogar />}
      </div>
    </div>
  );
};

export default Cadastro;
