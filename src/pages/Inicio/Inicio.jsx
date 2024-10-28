import styles from "./Inicio.module.css";

import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";
import { v4 as uuidv4 } from "uuid";

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
  const [tituloQuadro, setTituloQuadro] = useState("");
  const [imagemQuadro, setImagemQuadro] = useState(
    "https://cdn.blablacar.com/wp-content/uploads/br/2024/05/05094506/como-planejar-uma-viagem.webp"
  );
  const [abrirModalCriar, setAbrirModalCriar] = useState(false);
  const [membros, setMembros] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [resultadoPesquisa, setResultadoPesquisa] = useState([]);

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

  const criarQuadro = (titulo, membros) => {
    const quadroCriado = {
      titulo: titulo,
      id: uuidv4(),
      admin: usuarioAtual.id,
      membros: membros.map((item) => item.id),
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
                setResultadoPesquisa(quadrosFiltrados);
              }}
              value={pesquisa}
            />
          </label>
        </div>

        <div className={styles.quadros}>
          {resultadoPesquisa.length > 0 ? (
            <Pesquisa
              resultadoPesquisa={resultadoPesquisa}
              quadros={quadros}
              usuarioAtual={usuarioAtual}
            />
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
                  tituloQuadro={tituloQuadro}
                  setTituloQuadro={setTituloQuadro}
                  novoQuadro={(titulo, membros) => criarQuadro(titulo, membros)}
                  membros={membros}
                  setMembros={setMembros}
                  usuarioAtual={usuarioAtual}
                />
              </div>

              <Quadro
                quadros={quadros}
                setQuadros={setQuadros}
                usuarioAtual={usuarioAtual}
                setUsuarioAtual={setUsuarioAtual}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Inicio;
