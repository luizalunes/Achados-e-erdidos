
export function formatarData(data) {
  if (!data) return "Não informado";

  const partes = String(data).slice(0, 10).split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function obterLista(resposta) {
  if (Array.isArray(resposta)) return resposta;

  if (Array.isArray(resposta?.categorias)) {
    return resposta.categorias;
  }

  if (Array.isArray(resposta?.locais)) {
    return resposta.locais;
  }

  if (Array.isArray(resposta?.items)) {
    return resposta.items;
  }

  if (Array.isArray(resposta?.data)) {
    return resposta.data;
  }

  return [];
}

export function nomeDaOpcao(opcao) {
  if (typeof opcao === "string") return opcao;

  return opcao?.nome ?? opcao?.categoria ?? opcao?.local ?? "";
}

export function statusLegivel(status) {
  return status === "devolvido" ? "Devolvido" : "Aguardando";
}
