import styles from "./Cabecalho.module.css";
import logo from "../../assets/logo-roxo.png";

import { Link } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";
import { useContext } from "react";

const Cabecalho = ({ idUsuario }) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const usuario = usuarios.find((item) => item.id === idUsuario);

  return (
    <header className={styles.cabecalho}>
      <img src={logo} alt="Logo da gestio" className={styles.img_cabecalho} />
      <nav className={styles.navegacao}>
      <Link to="/home" state={{ idUsuario }} className={styles.link}>
          Quadros
        </Link>
        <Link to="/" className={styles.link}>
          Sair
        </Link>
        <div className={styles.minhaConta}>
          <img src={usuario.imagem} alt={usuario.nome} className={styles.img_cabecalho}/>
          <select></select>
        </div>
      </nav>
    </header>
  );
};

export default Cabecalho;
