// Integração total do styled components com o TypeScript.
// Este arquivo é usado exclusivamente para definição de tipos no TypeScript.
// Sejam interfaces, types, etc; a extensão sendo ".d.ts" é uma dica. NUNCA teremos código JavaScript, a não ser relacionado a tipagens.

import 'styled-components'

// Importo meu tema.
import { defaultTheme } from '../styles/themes/default'

// Eu estou guardando o valor das tipagens inferido automaticamente pelo TypeScript, dentro da variável ThemeType.
type ThemeType = typeof defaultTheme

// Agora, preciso criar uma tipagem para o módulo: styled-components.
// Sempre que eu importar o styled-components em algum arquivo, a definição de tipos usada pelo mesmo será o que eu definir aqui.
// Como minha intenção é simplesmente sobreescrever algo que já existe, e não quero escrever uma tipagem nova do zero, eu importei o styled-components.

// O que resta é, o que eu vou sobreescrever?
// Em Button.styles.ts, segurar o CTRL e clicar em theme. Um ThemeProps será exibido na listagem de tipos do Styled Components.
// No mesmo arquivo, vamos procurar pelo DefaultTheme; é a interface pela qual iremos avisar quais as propriedades do nosso tema.
declare module 'styled-components' {
  // Assim, esperamos que nosso tema possua essas três propriedades, dentro de ThemeType.
  // Então, ao digitarmos e apertar CTRL + Espaço, serão exibidas as propriedades que possuo, dentro de meu tema.
  export interface DefaultTheme extends ThemeType {}
}

// Agora, é importante frisar que isso não é algo que será visto com frequência no dia-a-dia.
// "Para ser sincero, a única vez que precisei fazer isso foi com o styled-components." - Diego Fernandes.
