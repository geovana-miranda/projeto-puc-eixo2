import styles from "./Formulario.module.css";

import Input from "../Formulario/Input/Input";
import Msg from "./Msg/Msg";

import semfoto from "../../assets/semfoto.png";

import { useState, useContext } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";

const Formulario = ({ cadastrarUsuario }) => {
  const { usuarios, setUsuarios } = useContext(UsuarioContext);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [imagem, setImagem] = useState(semfoto);
  const [concordar, setConcordar] = useState(false);
  const [msg, setMsg] = useState("");

  console.log(concordar);


  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const salvarUsuario = () => {
    const usuarioExiste = usuarios.find((item) => email === item.email);

    if (usuarioExiste) {
      setMsg({ mensagem: "Email já cadastrado", cor: "vermelho" });
      return;
    } else {
      setMsg("");
    }

    if (senha !== confirmarSenha) {
      setMsg({ mensagem: "As senhas são diferentes", cor: "vermelho" });
      return;
    } else {
      setMsg("");
    }

    if (!concordar) {
      setMsg({ mensagem: "Você precisa concordar com os termos de uso", cor: "vermelho" });
      return;
    }

    cadastrarUsuario({
      nome,
      email,
      senha,
      imagem,
      quadros: []
    });

    setMsg({ mensagem: "Usuário cadastrado com sucesso", cor: "verde" });

    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setConcordar(false);
    setImagem(semfoto);
    console.log(concordar);
  };

  return (
    <section className={styles.formulario}>
      <form onSubmit={handleSubmit}>

        <h3>Criar conta</h3>

        {msg && <Msg mensagem={msg} />}

        <div>
          <Input
            label={"Nome"}
            type={"text"}
            placeholder={"Digite seu nome"}
            valor={nome}
            setValor={setNome}
          />
          <Input
            label={"Email"}
            type={"email"}
            placeholder={"Digite seu email"}
            valor={email}
            setValor={setEmail}
          />
          <Input
            label={"Senha"}
            type={"password"}
            placeholder={"Digite sua senha"}
            valor={senha}
            setValor={setSenha}
          />
          <Input
            label={"Confirmar senha"}
            type={"password"}
            placeholder={"Confirme sua senha"}
            valor={confirmarSenha}
            setValor={setConfirmarSenha}
          />

        </div>

        <div className={styles.concordar}>
          <label>
            <input type="checkbox" onChange={(e) => setConcordar(e.target.checked)} checked={concordar} className={styles.botaoConcordar}/>
            <span className={styles.checkBox}></span>
          </label>
          <p>
            Concordo com os <span style={{cursor: "pointer"}}>Termos de Uso</span> e <span style={{cursor: "pointer"}}>Política de Privacidade</span>
          </p>
        </div>

        <div>
          <button onClick={salvarUsuario} className={styles.botaoFinalizar}>Finalizar Cadastro</button>
        </div>
      </form>
    </section>
  );
};

export default Formulario;
