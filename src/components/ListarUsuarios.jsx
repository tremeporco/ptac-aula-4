import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './api';

const listarUsuarios = (signal) => apiGet('/users', { signal });
const criarUsuario = (dados) => apiPost('/users', dados);
const atualizarUsuario = (id, dados) => apiPut(`/users/${id}`, dados);
const deletarUsuario = (id) => apiDelete(`/users/${id}`);

export default function ListaUsuarios({ onEditar, onExcluir }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function buscar() {
      try {
        setCarregando(true);
        setErro(null);
        
        const data = await listarUsuarios(signal);
        setUsuarios(data);
      } catch (e) {
        if (e.name === 'AbortError') return; 

        if (e instanceof ApiError) {
          if (e.status === 404) {
            setErro('Recurso não encontrado');
          } else if (e.status === 500) {
            setErro('Erro no servidor');
          } else {
            setErro(`Erro HTTP ${e.status}: ${e.statusText}`);
          }
        } 
        else if (e instanceof TypeError && e.message.includes('fetch')) {
          setErro('Falha de rede');
        } 
        else {
          setErro(e.message || 'Erro ao carregar usuários.');
        }
      } finally {
        if (!signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscar();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleExcluir(id) {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;

    try {
      await deletarUsuario(id); 
      
      setUsuarios((atuais) => atuais.filter((u) => u.id !== id));
      
      if (onExcluir) onExcluir(id);
    } catch (e) {
      alert('Não foi possível excluir o usuário no servidor.');
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => onEditar && onEditar(u)}>Editar</button>
          <button onClick={() => handleExcluir(u.id)}>Excluir</button> 
        </li>
      ))}
    </ul>
  );
}
