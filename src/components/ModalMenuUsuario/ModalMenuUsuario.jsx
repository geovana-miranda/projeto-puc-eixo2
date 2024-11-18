import styles from "./ModalMenuUsuario.module.css";

import { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const ModalMenuUsuario = ({
  usuarioAtual,
  abrirModalMenuUsuario,
  fecharModal,
}) => {
  const modalRef = useRef(null);
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
  if (!abrirModalMenuUsuario) return null;

  const navigate = useNavigate();

  const idUsuario = usuarioAtual.id;

  const minhaConta = (idUsuario) => {
    navigate("/minhaconta", { state: idUsuario });
  }

  return (
    <section className={styles.background}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.menu}>
          <div className={styles.conta}>
            <img src={usuarioAtual.imagem} alt={usuarioAtual.nome} />
            <div className={styles.infoConta}>
              <span className={styles.nome}>{usuarioAtual.nome}</span>
              <span className={styles.email}>{usuarioAtual.email}</span>
            </div>
          </div>
          <nav className={styles.itensMenu}>
            <ul className={styles.categoria}>
              <li>
                <a onClick={() => minhaConta(idUsuario)}>Minha conta</a>
              </li>
              <li>
                <Link to="/">Sair</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default ModalMenuUsuario;
