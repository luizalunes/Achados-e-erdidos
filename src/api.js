import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const chave = import.meta.env.VITE_API_KEY;

  if (chave) {
    config.headers["X-API-Key"] = chave;
  }

  return config;
});

export function mensagemErro(error) {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((erro) => erro.msg || JSON.stringify(erro))
        .join(", ");
    }

    return JSON.stringify(detail);
  }

  if (error.response?.status === 401) {
    return "Chave da API ausente ou inválida. Confira o arquivo .env.";
  }

  if (error.response?.status === 404) {
    return "O item solicitado não foi encontrado.";
  }

  if (!error.response) {
    return "Não foi possível conectar à API. Verifique sua conexão.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
