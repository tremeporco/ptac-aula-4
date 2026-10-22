// src/api.js

export const BASE_URL = 'https://exemplo.com'; 

export class ApiError extends Error {
  constructor(status, statusText, body) {
    super(statusText || `Erro HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

async function requisicao(endpoint, opcoes = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const { headers: headersExtras, signal, ...outrasOpcoes } = opcoes;

  const headersPadrao = {
    'Content-Type': 'application/json',
    ...headersExtras
  };

  const configuracao = {
    ...outrasOpcoes,
    headers: headersPadrao,
    signal 
  };

  const resposta = await fetch(url, configuracao);

  if (!resposta.ok) {
    throw new ApiError(resposta.status, resposta.statusText);
  }

  if (resposta.status === 204) return null;
  
  return resposta.json();
}

export const apiGet = (endpoint, opcoes = {}) => 
  requisicao(endpoint, { method: 'GET', ...opcoes });

export const apiPost = (endpoint, dados, opcoes = {}) => 
  requisicao(endpoint, { method: 'POST', body: JSON.stringify(dados), ...opcoes });

export const apiPut = (endpoint, dados, opcoes = {}) => 
  requisicao(endpoint, { method: 'PUT', body: JSON.stringify(dados), ...opcoes });

export const apiDelete = (endpoint, opcoes = {}) => 
  requisicao(endpoint, { method: 'DELETE', ...opcoes });
