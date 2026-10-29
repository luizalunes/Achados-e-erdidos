
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../componentes/Header";
import Loading from "../componentes/Loading";
import ErrorMessage from "../componentes/ErrorMessage";
import { api, mensagemErro } from "../api";
import { formatarData } from "../utils/formatar";

export default function ItemDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarItem = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api.get(`/itens/${id}`);
      setItem(resposta.data);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarItem();
  }, [carregarItem]);

  async function confirmarDevolucao(event) {
    event.preventDefault();
    setErroAcao("");

    if (!devolvidoPara.trim()) {
      setErroAcao("Informe o nome de quem recebeu o objeto.");
      return;
    }

    setSalvando(true);

    try {
      await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: devolvidoPara.trim(),
      });

      await carregarItem();
      setDevolvidoPara("");
    } catch (error) {
      setErroAcao(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirItem() {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${item.nome}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    setErroAcao("");
    setSalvando(true);

    try {
      await api.delete(`/itens/${id}`);
      navigate("/", {
        state: { mensagem: "Item excluído com sucesso." },
      });
    } catch (error) {
      setErroAcao(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="page-container detail-page">
        <Link to="/" className="back-link">← Voltar para os itens</Link>

        {carregando ? (
          <Loading texto="Carregando detalhes..." />
        ) : erro ? (
          <ErrorMessage mensagem={erro} onRetry={carregarItem} />
        ) : item ? (
          <>
            <section className="detail-banner">
              <span className="eyebrow">DETALHES DO OBJETO · #{item.id}</span>

              <div className="detail-title-row">
                <div>
                  <h1>{item.nome}</h1>
                  <span
                    className={`status status-${item.status === "devolvido" ? "devolvido" : "aguardando"}`}
                  >
                    <span className="status-dot" />
                    {item.status === "devolvido" ? "Devolvido" : "Aguardando"}
                  </span>
                </div>

                <div className="detail-symbol" aria-hidden="true">✳</div>
              </div>
            </section>

            {erroAcao && (
              <div className="inline-error" role="alert">{erroAcao}</div>
            )}

            <section className="detail-layout">
              <article className="panel detail-main">
                <span className="eyebrow">SOBRE O OBJETO</span>
                <h2>Informações do item</h2>

                <div className="detail-description">
                  <h3>Descrição</h3>
                  <p>{item.descricao || "Nenhuma descrição informada."}</p>
                </div>

                <div className="detail-fields">
                  <div>
                    <span>Categoria</span>
                    <strong>{item.categoria || "Não informada"}</strong>
                  </div>

                  <div>
                    <span>Local encontrado</span>
                    <strong>{item.local || "Não informado"}</strong>
                  </div>

                  <div>
                    <span>Data em que foi encontrado</span>
                    <strong>{formatarData(item.data_encontrado)}</strong>
                  </div>

                  {item.status === "devolvido" && (
                    <>
                      <div>
                        <span>Devolvido para</span>
                        <strong>{item.devolvido_para || "Não informado"}</strong>
                      </div>

                      <div>
                        <span>Data da devolução</span>
                        <strong>{formatarData(item.data_devolucao)}</strong>
                      </div>
                    </>
                  )}
                </div>
              </article>

              <aside className="panel detail-actions">
                <span className="eyebrow">GERENCIAR</span>
                <h2>Ações do item</h2>

                <Link
                  to={`/editar/${item.id}`}
                  className="button button-primary button-full"
                >
                  ✎ Editar item
                </Link>

                {item.status !== "devolvido" && (
                  <form onSubmit={confirmarDevolucao} className="return-form">
                    <label htmlFor="devolvidoPara">Registrar devolução</label>
                    <p>Informe quem recebeu o objeto.</p>

                    <input
                      id="devolvidoPara"
                      type="text"
                      placeholder="Nome de quem recebeu"
                      value={devolvidoPara}
                      onChange={(event) => setDevolvidoPara(event.target.value)}
                      required
                      maxLength={150}
                    />

                    <button
                      className="button button-success button-full"
                      type="submit"
                      disabled={salvando}
                    >
                      {salvando ? "Salvando..." : "✓ Confirmar devolução"}
                    </button>
                  </form>
                )}

                <button
                  className="button button-danger-outline button-full"
                  onClick={excluirItem}
                  disabled={salvando}
                >
                  Excluir item
                </button>
              </aside>
            </section>
          </>
        ) : null}
      </main>
    </>
  );
}
