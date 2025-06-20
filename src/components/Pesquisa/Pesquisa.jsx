import styles from "../Quadro/Quadro.module.css";

import { useNavigate } from "react-router-dom";

const Pesquisa = ({ resultadoPesquisa, quadros, usuarioAtual }) => {
  const navigate = useNavigate();

  const abrirQuadro = (quadro) => {
    navigate("/meuquadro", { state: { quadro, quadros, usuarioAtual } });
  };

  return (
    <>
      <ul className={styles.meusQuadros}>
        {resultadoPesquisa.map((quadro) => (
          <li className={styles.itemLista} key={quadro.id}>
            <div className={styles.infoQuadro}>
              <div
                className={styles.tituloImagem}
                onClick={() => abrirQuadro(quadro)}
              >
                <img src={quadro.imagem} alt="imagem de capa do quadro" />
                <p style={{ fontWeight: "500" }}>{quadro.titulo}</p>
              </div>
              
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pesquisa;
