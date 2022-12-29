import { ThemeProvider } from 'styled-components'
// import { Button } from './components/Button'
import { GlobalStyle } from './global'
import { Router } from './Router'

import { BrowserRouter } from 'react-router-dom'

import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    // O tema somente será aplicado a componentes dentro do ThemeProvider.
    // É importante notar que o ThemeProvider é semelhante a um fragment, no quesito em que ele não imprime um elemento em tela.
    <ThemeProvider theme={defaultTheme}>
      {/* É importante que o GlobalStyle esteja dentro de um ThemeProvider, senão ele não terá acesso às variáveis do nosso tema. No entanto, a posição do mesmo não importa. */}
      {/* <Button variant="primary" />
      <Button variant="secondary" />
      <Button variant="success" />
      <Button variant="danger" />
      <Button /> */}

      {/* É necessário que o BrowserRouter SEMPRE envolva nossas rotas. */}
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <GlobalStyle />
    </ThemeProvider>
  )
}
