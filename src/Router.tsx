import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout'

export function Router() {
  return (
    <Routes>
      {/* Para cada página, teremos uma rota (Route). */}
      {/* Essa tela é exibida por padrão, ao acessar a URL. */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>

      {/**
       * 1) Usando o outlet para outro layout...
       * 2) "Todas as rotas que começam com '/admin' usarão AdminLayout."
       * 3) As rotas são encadeadas; ou seja, a rota a seguir é acessada como uma soma de "/admin" e "/products": "/admin/products".
       */}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route path="/products" />
      </Route> */}
    </Routes>
  )
}
