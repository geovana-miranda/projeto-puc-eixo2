import styles from "../Quadro/Quadro.module.css";

import { useNavigate } from "react-router-dom";

const Pesquisa = ({
  resultadoPesquisa,
  quadros,
  usuarioAtual,
}) => {
  const navigate = useNavigate();

  const abrirQuadro = (quadro) => {
    navigate("/meuquadro", { state: { quadro, quadros, usuarioAtual } });
  };

  return (
    <>

      <h3 className={styles.tituloQuadros}>Resultado da pesquisa</h3>

      <ul className={styles.meusQuadros}>
        {resultadoPesquisa.map((quadro) => (
          <li className={styles.itemLista} key={quadro.id}>
            <div className={styles.infoQuadro}>
              <img
                src="https://cdn.blablacar.com/wp-content/uploads/br/2024/05/05094506/como-planejar-uma-viagem.webp"
                alt=""
              />
              <p onClick={() => abrirQuadro(quadro)}>{quadro.titulo}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pesquisa;