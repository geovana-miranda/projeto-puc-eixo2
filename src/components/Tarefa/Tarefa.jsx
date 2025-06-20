import { useRef, useEffect } from "react";
import styles from "./Tarefa.module.css";

const Tarefa = ({ criarTarefa, setCriarTarefa, tituloTarefa, setTituloTarefa, criandoTarefa }) => {

    const criarTituloTarefa = () => {
        criandoTarefa(tituloTarefa);
        setTituloTarefa("");
        setCriarTarefa(false)
    }
    
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus(); 
      }    }, [criarTarefa]);

  if (criarTarefa) {
    return (
      <>
        <input
        ref={inputRef}
          className={styles.inputCriarTarefa}
          type="text"
          value={tituloTarefa}
          onChange={(e) => setTituloTarefa(e.target.value)}
          onKeyDown={e=> (e.key === "Enter" ? criarTituloTarefa() : "")}
        />
      </>
    );
  } else {
    return (
      <div className={styles.criarTarefa}>
        <span>+ Criar tarefa</span>
      </div>
    );
  }
};

export default Tarefa;
