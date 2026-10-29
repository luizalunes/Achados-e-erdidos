
import { Link } from "react-router-dom";
import { formatarData } from "../utils/formatar";

export default function ItemCard({ item }) {
  const devolvido = item.status === "devolvido";

  return (
    <Link to={`/item/${item.id}`} className="item-card">
      <div className="item-card-top">
        <span className="item-symbol">
          {devolvido ? "✓" : "⌕"}
        </span>

        <span
          className={`status status-${devolvido ? "devolvido" : "aguardando"}`}
        >
          <span className="status-dot" />
          {devolvido ? "Devolvido" : "Aguardando"}
        </span>
      </div>

      <div className="item-card-content">
        <h3>{item.nome}</h3>
        <p>{item.descricao || "Sem descrição informada."}</p>
      </div>

      <div className="item-card-meta">
        <span>◈ {item.categoria || "Sem categoria"}</span>
        <span>⌖ {item.local || "Local não informado"}</span>
      </div>

      <div className="item-card-footer">
        <span>Encontrado em {formatarData(item.data_encontrado)}</span>
        <span className="card-arrow">↗</span>
      </div>
    </Link>
  );
}
