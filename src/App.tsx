import { HashRouter, MemoryRouter } from 'react-router-dom'
import { Layout } from './components/Layout'

// HashRouter: funziona su qualsiasi hosting statico senza configurare i rewrite.
// MemoryRouter solo per l'anteprima incorporata (VITE_ROUTER=memory).
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : HashRouter

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}
