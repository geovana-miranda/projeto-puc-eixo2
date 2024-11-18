import styles from "./Inicio.module.css";

import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";

import Cabecalho from "../../components/Cabecalho/Cabecalho";
import ModalCriarQuadro from "../../components/ModalCriarQuadro/ModalCriarQuadro";
import Quadro from "../../components/Quadro/Quadro";
import Pesquisa from "../../components/Pesquisa/Pesquisa";

const Inicio = () => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const location = useLocation();
  const idUsuario = location.state?.idUsuario;

  const [usuarioAtual, setUsuarioAtual] = useState("");
  const [usuariosCarregados, setUsuariosCarregados] = useState(false);

  const [quadros, setQuadros] = useState([]);

  const [abrirModalCriar, setAbrirModalCriar] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [resultadoPesquisa, setResultadoPesquisa] = useState([]);
  const [pesquisando, setPesquisando] = useState(false);

  useEffect(() => {
    const usuariosSalvos = localStorage.getItem("usuarios");

    if (usuariosSalvos) {
      setUsuarios(JSON.parse(usuariosSalvos));
      setUsuariosCarregados(true);
    }
  }, []);

  useEffect(() => {
    if (usuariosCarregados) {
      const usuario = usuarios.find((item) => item.id === idUsuario);
      setUsuarioAtual(usuario);
      setUsuariosCarregados(false);
    }
  }, [usuariosCarregados]);

  useEffect(() => {
    const quadrosUsuarios = usuarioAtual.quadros;
    setQuadros(quadrosUsuarios || []);
  }, [usuarioAtual]);

  const meusQuadros = quadros.filter(
    (item) => !item.membros || item.membros.length === 0
  );

  const quadrosCompartilhados = quadros.filter(
    (item) => item.membros && item.membros.length > 0
  );

  return (
    <div className={styles.pagina}>
      <Cabecalho idUsuario={idUsuario} />

      <section className={styles.container}>
        <div className={styles.pesquisa}>
          <label>
            <span class="material-symbols-outlined">search</span>
            <input
              className={styles.pesquisaInput}
              type="text"
              placeholder="Procurar por quadro"
              onChange={(e) => {
                const quadroPesquisa = e.target.value;
                setPesquisa(quadroPesquisa);

                let quadrosFiltrados;

                if (quadroPesquisa === "") {
                  quadrosFiltrados = [];
                } else {
                  quadrosFiltrados = quadros.filter((quadro) =>
                    quadro.titulo
                      .toLowerCase()
                      .startsWith(quadroPesquisa.toLowerCase())
                  );
                }

                if (e.target.value) {
                  setPesquisando(true);
                }

                if (!e.target.value) {
                  setPesquisando(false);
                }
                
                setResultadoPesquisa(quadrosFiltrados);
              }}
              value={pesquisa}
            />
          </label>
        </div>

        <div className={styles.quadros}>
          {pesquisando ? (
            <>
              <h3 className={styles.tituloQuadros}>Resultado da pesquisa</h3>
              {resultadoPesquisa.length > 0 && (
                <Pesquisa
                  resultadoPesquisa={resultadoPesquisa}
                  quadros={quadros}
                  usuarioAtual={usuarioAtual}
                />
              )}

              {resultadoPesquisa.length <= 0 && <p className={styles.naoEncontrado}>Nenhum quadro foi encontrado.</p>}
            </>
          ) : (
            <>
              <div className={styles.criarQuadro}>
                <button
                  className={styles.botaoCriarQuadro}
                  onClick={() => {
                    setAbrirModalCriar(!abrirModalCriar);
                  }}
                >
                  +
                </button>
                <p>Criar novo quadro</p>

                <ModalCriarQuadro
                  quadros={quadros}
                  abrirModalCriar={abrirModalCriar}
                  setAbrirModalCriar={setAbrirModalCriar}
                  usuarioAtual={usuarioAtual}
                  setUsuarioAtual={setUsuarioAtual}
                />
              </div>

              {meusQuadros.length > 0 && (
                <>
                  <h3 className={styles.tituloQuadros}>Meus quadros</h3>
                  <Quadro
                    quadrosExibidos={meusQuadros}
                    quadros={quadros}
                    setQuadros={setQuadros}
                    usuarioAtual={usuarioAtual}
                    setUsuarioAtual={setUsuarioAtual}
                  />
                </>
              )}

              {quadrosCompartilhados.length > 0 && (
                <>
                  <h3 className={styles.tituloQuadros}>
                    Quadros compartilhados
                  </h3>

                  <Quadro
                    quadrosExibidos={quadrosCompartilhados}
                    quadros={quadros}
                    setQuadros={setQuadros}
                    usuarioAtual={usuarioAtual}
                    setUsuarioAtual={setUsuarioAtual}
                  />
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Inicio;
