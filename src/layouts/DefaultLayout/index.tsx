import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutContainer } from './styles'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />

      {/**
       * O Outlet é "um espaço usado para inserir um conteúdo", que varia de acordo com cada página ou cenário.
       * Ou seja, posso reutilizar uma mesma estrutura em várias telas, alterando somente uma seção específica.
       */}

      <Outlet />
    </LayoutContainer>
  )
}
