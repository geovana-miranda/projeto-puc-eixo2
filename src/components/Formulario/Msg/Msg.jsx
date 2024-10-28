import styles from "./Msg.module.css";

const Msg = ({mensagem}) => {

  return (
    <div className={ (mensagem.cor === "vermelho") ? styles.msgErro : styles.msgSucesso}>
    <p>{mensagem.mensagem}</p>
  </div>
  )
}

export default Msg