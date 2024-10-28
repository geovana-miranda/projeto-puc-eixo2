import styles from "./Quadro.module.css";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useContext } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { useNavigate } from "react-router-dom";

import ModalAlterarQuadro from "../ModalAlterarQuadro/ModalAlterarQuadro";

const Quadro = ({ quadros, setQuadros, usuarioAtual, setUsuarioAtual }) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [quadroSelecionado, setQuadroSelecionado] = useState("");
  const [abrirModalAlterar, setAbrirModalAlterar] = useState(false);
  const navigate = useNavigate();

  const meusQuadros = quadros.filter(
    (item) => !item.membros || item.membros.length === 0
  );

  const quadrosCompartilhados = quadros.filter(
    (item) => item.membros && item.membros.length > 0
  );

  const abrirQuadro = (quadro) => {
    navigate("/meuquadro", { state: { quadro, usuarioAtual } });
  };

  const excluirQuadro = (id) => {
    const usuariosAtualizados = usuarios.map((usuario) => ({
      ...usuario,
      quadros: usuario.quadros.filter((quadro) => quadro.id !== id),
    }));

    const usuarioAtualizado = usuariosAtualizados.find(
      (item) => item.id === usuarioAtual.id
    );
    setUsuarioAtual(usuarioAtualizado);

    setUsuarios(usuariosAtualizados);

    localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));
  };

  const alterarQuadro = (quadro, titulo, idMembros) => {
    const quadroAlterado = {
      ...quadro,
      titulo: titulo,
      membros: idMembros || [],
    };

    const usuariosAtualizados = usuarios.map((usuario) => {
      if (usuario.id === usuarioAtual.id) {
        return {
          ...usuario,
          quadros: usuario.quadros.map((item) =>
            item.id === quadro.id ? quadroAlterado : item
          ),
        };
      }

      if (!idMembros.includes(usuario.id)) {
        return {
          ...usuario,
          quadros: usuario.quadros.filter((item) => item.id !== quadro.id) || [],
        };
      } else {
        const quadrosMembro = usuario.quadros.filter(
          (item) => item.id !== quadro.id
        );
        return { ...usuario, quadros: [...quadrosMembro, quadroAlterado] };
      }
    });

    localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));

    setUsuarios(usuariosAtualizados);

    setUsuarioAtual((usuarioAtual) => ({
      ...usuarioAtual,
      quadros: quadros.map((item) =>
        item.id === quadro.id ? quadroAlterado : item
      ),
    }));
  };

  const calcularTempoDesdeAtualizacao = (dataAtualizacao) => {
    const dataAtual = new Date();
    const dataAtualizacaoDate = new Date(dataAtualizacao);

    const diferencaEmMilissegundos = dataAtual - dataAtualizacaoDate;
    const segundos = Math.floor(diferencaEmMilissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Atualizado há ${dias} dia${dias > 1 ? "s" : ""}`;
    } else if (horas > 0) {
      return `Atualizado há ${horas} hora${horas > 1 ? "s" : ""}`;
    } else if (minutos > 0) {
      return `Atualizado há ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    } else {
      return "Atualizado há menos de um minuto";
    }
  };

  return (
    <>
      {meusQuadros.length > 0 && (
        <>
          <h3 className={styles.tituloQuadros}>Meus quadros</h3>
          <ul className={styles.meusQuadros}>
            {meusQuadros.map((quadro) => (
              <li className={styles.itemLista} key={quadro.id}>
                <div className={styles.infoQuadro}>
                  <img
                    src="https://cdn.blablacar.com/wp-content/uploads/br/2024/05/05094506/como-planejar-uma-viagem.webp"
                    alt="imagem de cada do quadro {quadro.titulo}"
                  />
                  <p className={styles.tituloQuadro} onClick={() => abrirQuadro(quadro)}>{quadro.titulo}</p>
                  {quadro.dataAtualizacao ? <span className={styles.atualizado}>{calcularTempoDesdeAtualizacao(quadro.dataAtualizacao)}</span> : "" }
                </div>

                {quadro.admin == usuarioAtual.id && (
                  <BsThreeDotsVertical
                    className={styles.icone}
                    onClick={() => {
                      setAbrirModalAlterar(true);
                      setQuadroSelecionado(quadro);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {quadrosCompartilhados.length > 0 && (
        <>
          <h3 className={styles.tituloQuadros}>Quadros compartilhados</h3>
          <ul className={styles.meusQuadros}>
            {quadrosCompartilhados.map((quadro) => (
              <li className={styles.itemLista} key={quadro.id}>
                <div className={styles.infoQuadro}>
                  <img src="https://cdn.blablacar.com/wp-content/uploads/br/2024/05/05094506/como-planejar-uma-viagem.webp" alt="imagem de cada do quadro {quadro.titulo}" />
                  <p className={styles.tituloQuadro} onClick={() => abrirQuadro(quadro)}>{quadro.titulo}</p>
                  {quadro.dataAtualizacao ? <span className={styles.atualizado}>{calcularTempoDesdeAtualizacao(quadro.dataAtualizacao)}</span> : "" }
                </div>

                {quadro.admin == usuarioAtual.id && (
                  <BsThreeDotsVertical
                    className={styles.icone}
                    onClick={() => {
                      setAbrirModalAlterar(true);
                      setQuadroSelecionado(quadro);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {abrirModalAlterar && (
        <ModalAlterarQuadro
          quadros={quadros}
          setQuadros={setQuadros}
          abrirModalAlterar={abrirModalAlterar}
          setAbrirModalAlterar={setAbrirModalAlterar}
          quadroSelecionado={quadroSelecionado}
          excluirQuadro={(id) => excluirQuadro(id)}
          alterarQuadro={(quadro, titulo, idMembros) =>
            alterarQuadro(quadro, titulo, idMembros)
          }
          excluirMembro={(id) => excluirMembro(id)}
          usuarioAtual={usuarioAtual}
        />
      )}
    </>
  );
};

export default Quadro;
