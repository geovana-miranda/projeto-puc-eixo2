import { useRef, useEffect } from "react";
import styles from "./CriarLista.module.css";

const CriarLista = ({ criarLista, tituloLista, setTituloLista, criandoLista }) => {
  
  const criarTituloLista = () => {
    criandoLista(tituloLista);
    setTituloLista("");
  }

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); 
    }    }, [criarLista]);
  
    if (criarLista) {
    return (
      <>
        <input
        ref={inputRef}
          type="text"
          placeholder="Nome da lista"
          className={styles.inputLista}
          value={tituloLista}
          onChange={e => setTituloLista(e.target.value)}
          onKeyDown={e => (e.key === "Enter" ? criarTituloLista() : "")}
        />
      </>
    );
  } else {
    return (
      <>
        <h4 className={styles.tituloLista}>+ Criar Lista</h4>
      </>
    );
  }
};

export default CriarLista;