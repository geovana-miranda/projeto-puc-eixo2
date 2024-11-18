import styles from "./Quadro.module.css";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useContext } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { useNavigate } from "react-router-dom";

import ModalAlterarQuadro from "../ModalAlterarQuadro/ModalAlterarQuadro";

const Quadro = ({
  quadros,
  setQuadros,
  usuarioAtual,
  setUsuarioAtual,
  quadrosExibidos,
}) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [quadroSelecionado, setQuadroSelecionado] = useState("");
  const [abrirModalAlterar, setAbrirModalAlterar] = useState(false);
  const navigate = useNavigate();

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

  const alterarQuadro = (
    quadro,
    titulo,
    idMembros,
    imagemQuadro,
    nomeImagem
  ) => {
    const quadroAlterado = {
      ...quadro,
      titulo: titulo,
      membros: idMembros || [],
      imagem: imagemQuadro,
      nomeImagem: nomeImagem,
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
          quadros:
            usuario.quadros.filter((item) => item.id !== quadro.id) || [],
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
      <ul className={styles.meusQuadros}>
        {quadrosExibidos.map((quadro) => (
          <li className={styles.itemLista} key={quadro.id}>
            <div className={styles.infoQuadro}>
              <div
                className={styles.tituloImagem}
                onClick={() => abrirQuadro(quadro)}
              >
                <img src={quadro.imagem} alt="imagem de capa do quadro" />
                <p>{quadro.titulo}</p>
              </div>

              {quadro.dataAtualizacao ? (
                <span className={styles.atualizado}>
                  {calcularTempoDesdeAtualizacao(quadro.dataAtualizacao)}
                </span>
              ) : (
                ""
              )}
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

      {abrirModalAlterar && (
        <ModalAlterarQuadro
          quadros={quadros}
          setQuadros={setQuadros}
          abrirModalAlterar={abrirModalAlterar}
          setAbrirModalAlterar={setAbrirModalAlterar}
          quadroSelecionado={quadroSelecionado}
          excluirQuadro={(id) => excluirQuadro(id)}
          alterarQuadro={(
            quadro,
            titulo,
            idMembros,
            imagemQuadro,
            nomeImagem
          ) =>
            alterarQuadro(quadro, titulo, idMembros, imagemQuadro, nomeImagem)
          }
          excluirMembro={(id) => excluirMembro(id)}
          usuarioAtual={usuarioAtual}
        />
      )}
    </>
  );
};

export default Quadro;
