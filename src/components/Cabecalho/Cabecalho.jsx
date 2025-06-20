import styles from "./Cabecalho.module.css";
import logo from "../../assets/logo-roxo.png";

import { Link } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";
import { useContext, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

import ModalMenuUsuario from "../ModalMenuUsuario/ModalMenuUsuario";

const Cabecalho = ({ idUsuario }) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [abrirModalMenuUsuario, setAbrirModalMenuUsuario] = useState(false);

  const usuarioAtual = usuarios.find((item) => item.id === idUsuario);

  return (
    <header className={styles.cabecalho}>
      <img src={logo} alt="Logo da gestio" className={styles.img_cabecalho} />
      <nav className={styles.navegacao}>
        <Link to="/home" state={{ idUsuario }} className={styles.link}>
          Quadros
        </Link>
        <div className={styles.minhaConta}>
          <img
            src={usuarioAtual.imagem}
            alt={usuarioAtual.nome}
            className={styles.img_cabecalho}
          />
          <RiArrowDropDownLine
            className={styles.icone}
            onClick={() => setAbrirModalMenuUsuario(!abrirModalMenuUsuario)}
          />

          {abrirModalMenuUsuario && (
            <ModalMenuUsuario
              fecharModal={() => setAbrirModalMenuUsuario(false)}
              usuarioAtual={usuarioAtual}
              abrirModalMenuUsuario={abrirModalMenuUsuario}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Cabecalho;
