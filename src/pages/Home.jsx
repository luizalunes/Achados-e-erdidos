
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../componentes/Header";
import ItemCard from "../componentes/ItemCard";
import Loading from "../componentes/Loading";
import ErrorMessage from "../componentes/ErrorMessage";
import { api, mensagemErro } from "../api";
import { obterLista, nomeDaOpcao } from "../utils/formatar";

export default function Home() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  const carregarItens = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const params = {};

      if (busca.trim()) params.busca = busca.trim();
      if (status) params.status = status;
      if (categoria) params.categoria = categoria;
      if (local) params.local = local;

      const resposta = await api.get("/itens", { params });

      const lista = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data?.itens ?? resposta.data?.items ?? [];

      setItens(lista);
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }, [busca, status, categoria, local]);

  useEffect(() => {
    carregarItens();
  }, [carregarItens, atualizacao]);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [resCategorias, resLocais] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais"),
        ]);

        setCategorias(obterLista(resCategorias.data));
        setLocais(obterLista(resLocais.data));
      } catch (error) {
        console.error("Não foi possível carregar os filtros:", error);
      }
    }

    carregarOpcoes();
  }, []);

  function limparFiltros() {
    setBusca("");
    setStatus("");
    setCategoria("");
    setLocal("");
  }

  return (
    <>
      <Header />

      <main className="page-container">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">IFRN · PAU DOS FERROS</span>
            <h1>Achados<br /><span>e perdidos.</span></h1>

            <div className="hero-actions">
              <a href="#lista" className="button button-primary">
                Explorar itens <span>↓</span>
              </a>

              <Link to="/novo" className="button button-light">
                + Cadastrar item
              </Link>
            </div>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="illustration-circle">
              <span className="illustration-star star-one">✳</span>
              <span className="illustration-star star-two">✦</span>
              <div className="illustration-card">
                <span className="illustration-check">✓</span>
                <span className="illustration-line line-one" />
                <span className="illustration-line line-two" />
                <span className="illustration-line line-three" />
              </div>
              <span className="illustration-search">⌕</span>
            </div>
          </div>
        </section>

        <section className="list-section" id="lista">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MURAL DO CAMPUS</span>
              <h2>Itens encontrados<span className="heading-period">.</span></h2>
              <p>Um objeto pode estar esperando por você.</p>
            </div>

            <Link to="/novo" className="button button-primary">
              + Novo item
            </Link>
          </div>

          <div className="filters">
            <div className="search-field">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Buscar por nome ou descrição..."
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                aria-label="Buscar por nome ou descrição"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="">Todos os status</option>
              <option value="aguardando">Aguardando</option>
              <option value="devolvido">Devolvido</option>
            </select>

            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((opcao, index) => {
                const nome = nomeDaOpcao(opcao);

                return (
                  <option key={nome || index} value={nome}>
                    {nome}
                  </option>
                );
              })}
            </select>

            <select
              value={local}
              onChange={(event) => setLocal(event.target.value)}
              aria-label="Filtrar por local"
            >
              <option value="">Todos os locais</option>
              {locais.map((opcao, index) => {
                const nome = nomeDaOpcao(opcao);

                return (
                  <option key={nome || index} value={nome}>
                    {nome}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="results-heading">
            <span>
              {carregando
                ? "Buscando itens..."
                : `${itens.length} ${itens.length === 1 ? "item encontrado" : "itens encontrados"}`}
            </span>

            {(busca || status || categoria || local) && (
              <button className="text-button" onClick={limparFiltros}>
                Limpar filtros ×
              </button>
            )}
          </div>

          {carregando ? (
            <Loading texto="Carregando itens..." />
          ) : erro ? (
            <ErrorMessage
              mensagem={erro}
              onRetry={() => setAtualizacao((valor) => valor + 1)}
            />
          ) : itens.length === 0 ? (
            <div className="state-box empty-box">
              <span className="state-icon">⌕</span>
              <h3>Nenhum item encontrado</h3>
              <p>
                Tente mudar os filtros ou cadastre um objeto que foi
                encontrado no campus.
              </p>
              <button className="button button-secondary" onClick={limparFiltros}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {itens.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <footer className="site-footer">
          <span>Achados<span className="brand-highlight">+</span> · IFRN</span>
          <span>Conectando objetos aos seus donos.</span>
        </footer>
      </main>
    </>
  );
}
