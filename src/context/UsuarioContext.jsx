import { createContext, useState } from "react";

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([
    {
      id: "1",
      nome: "Geovana",
      email: "geovana@gmail.com",
      senha: "12345",
      imagem: "https://github.com/geovana-miranda.png",
      quadros: []
    },
    {
      id: "2",
      nome: "Azuylla",
      email: "azuylla@gmail.com",
      senha: "123",
      imagem: "https://github.com/Azuylla.png",
      quadros: []
    }
  ]);

  return (
    <UsuarioContext.Provider value={{ usuarios, setUsuarios }}>
      {children}
    </UsuarioContext.Provider>
  );
};
