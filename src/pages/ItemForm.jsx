import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../componentes/Header";
import Loading from "../componentes/Loading";
import { api, mensagemErro } from "../api";
import { obterLista, nomeDaOpcao } from "../utils/formatar";

const categorias =[
  "Eletronicos",
  "Material escolar",
  "Documentos",
  "Bolsa e mochilas",
  "Roupas",
  "Chaves",
  "Acessorios",
  "Outros",
];

const locais =[
  "Biblioteca",
  "Sala de aula",
  "Laboratorio",
  "Cantina",
   "Patio",
   "Banheiros",
   "Quadra",
   "Outros",
];
const formularioInicial = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: "",
};

export default function ItemForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        const requisicoes = [
          api.get("/categorias"),
          api.get("/locais"),
        ];

        if (editando) {
          requisicoes.push(api.get(`/itens/${id}`));
        }

        const respostas = await Promise.all(requisicoes);

        if (!ativo) return;

        setCategorias(obterLista(respostas[0].data));
        setLocais(obterLista(respostas[1].data));

        if (editando) {
          const item = respostas[2].data;

          setFormulario({
            nome: item.nome || "",
            descricao: item.descricao || "",
            categoria: item.categoria || "",
            local: item.local || "",
            data_encontrado: item.data_encontrado
              ? String(item.data_encontrado).slice(0, 10)
              : "",
          });
        }
      } catch (error) {
        if (ativo) setErro(mensagemErro(error));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [id, editando]);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));

    setErro("");
    setSucesso("");
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    const dados = {
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      categoria: formulario.categoria,
      local: formulario.local,
      data_encontrado: formulario.data_encontrado,
    };

    try {
      if (editando) {
        await api.put(`/itens/${id}`, dados);
        setSucesso("Item atualizado com sucesso!");
      } else {
        await api.post("/itens", dados);
        setSucesso("Item cadastrado com sucesso!");
      }

      navigate("/", {
        state: {
          mensagem: editando
            ? "Item atualizado com sucesso."
            : "Item cadastrado com sucesso.",
        },
      });
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <>
        <Header />
        <main className="page-container">
          <Loading texto="Carregando formulário..." />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="page-container form-page">
        <Link to={editando ? `/item/${id}` : "/"} className="back-link">
          ← Voltar
        </Link>

        <section className="form-heading">
          <span className="eyebrow">MURAL DO CAMPUS · IFRN</span>
          <h1>{editando ? "Editar item" : "Novo item"}<span className="heading-period">.</span></h1>
          <p>
            {editando
              ? "Atualize as informações do objeto encontrado."
              : "Registre um objeto encontrado para ajudar a devolvê-lo ao dono."}
          </p>
        </section>

        <form className="panel item-form" onSubmit={salvar}>
          {erro && (
            <div className="inline-error" role="alert">{erro}</div>
          )}

          {sucesso && (
            <div className="inline-success" role="status">{sucesso}</div>
          )}

          <div className="form-section-title">
            <span className="form-step">01</span>
            <div>
              <h2>Sobre o objeto</h2>
              <p>Preencha os dados para identificar o item.</p>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="nome">Nome do objeto *</label>
            <input
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={alterarCampo}
              placeholder="Ex.: Garrafa térmica azul"
              required
              minLength={2}
              maxLength={120}
            />
          </div>

          <div className="form-field">
            <label htmlFor="descricao">Descrição *</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao}
              onChange={alterarCampo}
              placeholder="Descreva cor, marca, características ou detalhes..."
              required
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={alterarCampo}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
  <option key={categoria} value={categoria}>
    {categoria}
  </option>
))}
                
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="local">Local encontrado *</label>
              <select
                id="local"
                name="local"
                value={formulario.local}
                onChange={alterarCampo}
                required
              >
                <option value="">Selecione um local</option>
                {locais.map((local) => (
  <option key={local} value={local}>
    {local}
  </option>
))}
               
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="data_encontrado">Data em que foi encontrado *</label>
            <input
              id="data_encontrado"
              name="data_encontrado"
              type="date"
              value={formulario.data_encontrado}
              onChange={alterarCampo}
              required
            />
          </div>

          <p className="form-note">* Campos obrigatórios.</p>

          <div className="form-actions">
            <Link
              to={editando ? `/item/${id}` : "/"}
              className="button button-secondary"
            >
              Cancelar
            </Link>

            <button
              className="button button-primary"
              type="submit"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : editando
                  ? "Salvar alterações →"
                  : "Cadastrar item →"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
