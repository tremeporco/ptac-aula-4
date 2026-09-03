import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../index.css";
import App from '../App.jsx'
import { useEffect, useState } from "react";


export default function  ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
  const controller = new AbortController()
  const { signal } = controller

  
    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch('https://jsonplaceholder.typicode.com/users',{ signal })
        if (!resp.ok) {
          // 4xx ou 5xx — fetch NÃO rejeita para esses status! Precisamos lançar à mão.
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
        }
        const data = await resp.json()
        setUsuarios(data)
        setCarregando(false)
      } catch (e) {
        if (e.name === 'AbortError') return
        setErro(e.message)
      } finally {
  if (!signal.aborted) setCarregando(false)      }
    }
      buscar()
    return () => controller.abort()
  
  }, [])

  if (carregando) return <p>Carregando...</p>
  if (erro)     return <p>Erro: {erro}</p>
  if (usuarios.length === 0) return <p>Nenhum usuário encontrado.</p>

  
  return (
    <>
  
    <p>Sucesso: {usuarios.length} itens carregados.</p>
    <ul>
      {usuarios.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
      </>
  )
}


