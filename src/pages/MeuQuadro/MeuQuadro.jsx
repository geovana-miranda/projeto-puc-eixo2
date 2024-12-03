import styles from "./MeuQuadro.module.css";

import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UsuarioContext } from "../../context/UsuarioContext";
import { v4 as uuidv4 } from "uuid";

import Cabecalho from "../../components/Cabecalho/Cabecalho";
import CriarLista from "../../components/CriarLista/CriarLista";
import Lista from "../../components/Lista/Lista";

const MeuQuadro = () => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const location = useLocation();
  const { quadro, usuarioAtual } = location.state;
  const idUsuario = usuarioAtual.id;
  const idMembros = quadro.membros || [];

  const [pessoas, setPessoas] = useState([]);
  const [quadroUsuario, setQuadroUsuario] = useState(quadro);
  const [listas, setListas] = useState(quadroUsuario.listas || []);
  const [criarLista, setCriarLista] = useState(false);

  const [tituloLista, setTituloLista] = useState("");

  const quadroAnterior = useRef(quadroUsuario);
  const quadroInicializado = useRef(false);
 
  useEffect(() => {
    const membros = usuarios.filter((usuario) =>
      idMembros.includes(usuario.id)
    );
    const admin = usuarios.find((usuario) => usuario.id === quadro.admin);
    setPessoas([...membros, admin]);
  }, []);

  useEffect(() => {
    const idQuadro = quadroUsuario.id;

    const usuariosAtualizado = usuarios.map((usuario) => ({
      ...usuario,
      quadros: usuario.quadros
        ? usuario.quadros.map((item) =>
            item.id === idQuadro ? quadroUsuario : item
          )
        : [],
    }));
    const usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios")) || [];

    const houveMudanca =
      JSON.stringify(usuariosAtualizado) !==
      JSON.stringify(usuariosLocalStorage);

    if (houveMudanca) {
      localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizado));
    }

    quadroAnterior.current = quadroUsuario;
  }, [quadroUsuario]);

  useEffect(() => {
    if (quadroInicializado.current) {
      if (
        JSON.stringify(quadroUsuario.listas) !== JSON.stringify(listas)
      ) {
        setQuadroUsuario((atualQuadroUsuario) => ({
          ...atualQuadroUsuario,
          listas: listas,
          dataAtualizacao: new Date().toISOString(),
        }));
      }
    } else {
      quadroInicializado.current = true;
    }
  }, [listas]);

  const criandoLista = (titulo) => {
    if (titulo) {
      setListas([...listas, { titulo: titulo, id: uuidv4() }]);
      setTituloLista("");
    }
    setCriarLista(false);
  };

  return (
    <div className={styles.pagina}>
      <Cabecalho idUsuario={idUsuario} />

      <div className={styles.nomeQuadro}>
        <h3>{quadroUsuario.titulo}</h3>
        <div className={styles.imagemMembros}>
          {pessoas.map((pessoa) => (
            <img
              className={styles.fotoMembros}
              key={pessoa.id}
              src={pessoa.imagem}
              alt={pessoa.nome}
            />
          ))}
        </div>
      </div>

      <div className={styles.listas}>
        {listas.length > 0 && (
          <div className={styles.organizacaoListas}>
            {listas.map((item) => (
              <div key={item.id}>
                <Lista
                  lista={item}
                  listas={listas}
                  setListas={setListas}
                  pessoas={pessoas}
                />
              </div>
            ))}
          </div>
        )}

        <div onClick={() => setCriarLista(true)}>
          <CriarLista
            criarLista={criarLista}
            tituloLista={tituloLista}
            setTituloLista={setTituloLista}
            criandoLista={(titulo) => criandoLista(titulo)}
          />
        </div>
      </div>
    </div>
  );
};

export default MeuQuadro;
