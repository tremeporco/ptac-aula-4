import { useEffect, useState } from 'react';

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
        
        const resp = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
        
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`);
        }
        
        const data = await resp.json();
     
        
        setUsuarios(data);
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(e.message);
      } finally {
        if (!signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscar();

    return () => controller.abort();
  }, []);

  async function excluirUsuario(id) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    try {
      const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      console.log(`Usuário ${id} excluído`);

      setUsuarios((usuariosAtuais) => usuariosAtuais.filter((u) => u.id !== id));
      
      if (onExcluir) onExcluir(id);
      
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (usuarios.length === 0) return <p>Nenhum usuário encontrado.</p>;

  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => onEditar(u)}>Editar</button>
          <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}
