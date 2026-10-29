
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, mensagemErro } from "../api";

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await api.get("/eu");
        setUsuario(resposta.data);
      } catch (error) {
        setErro(mensagemErro(error));
      }
    }

    carregarUsuario();
  }, []);

  const nome = usuario?.nome || usuario?.name;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">✳</span>
          <span>
            <strong>Achados<span className="brand-highlight">+</span></strong>
            <small>IFRN · Campus Pau dos Ferros</small>
          </span>
        </Link>

        <div className="user-info">
          <span className="user-avatar">
            {nome ? nome.charAt(0).toUpperCase() : "A"}
          </span>

          <div className="user-text">
            <small>Bem-vindo(a)</small>
            <strong>
              {nome || (erro ? "Aluno" : "Carregando...")}
            </strong>
          </div>
        </div>
      </div>
    </header>
  );
}
