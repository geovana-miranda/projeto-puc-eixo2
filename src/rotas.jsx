import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UsuarioProvider } from "./context/UsuarioContext";

import Cadastro from "./pages/Cadastro/Cadastro";
import Inicio from "./pages/Inicio/Inicio";
import MeuQuadro from "./pages/MeuQuadro/MeuQuadro";
import MinhaConta from "./pages/MinhaConta/MinhaConta";

function App() {
  return (
    <BrowserRouter>
      <UsuarioProvider>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/home" element={<Inicio />} />
          <Route path="/meuquadro" element={<MeuQuadro />} />
          <Route path="/minhaconta" element={<MinhaConta />} />

        </Routes>
      </UsuarioProvider>
    </BrowserRouter>
  );
}

export default App;
