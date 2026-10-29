
export default function Loading({ mensagem = "Carregando..." }) {
  return (
    <div className="state-box">
      <div className="spinner"></div>
      <h3>{mensagem}</h3>
      <p>Aguarde um instante.</p>
    </div>
  );
}