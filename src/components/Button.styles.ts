import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

interface ButtonContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  border: 0;
  margin: 8px;

  // Eu posso acessar meu tema, através dos props enviados desde o App.tsx.
  background-color: ${(props) =>
    props.theme[
      'green-500'
    ]}; // "primary" retorna a cor "purple", conforme definimos no theme.
  color: ${(props) => props.theme.white};

  /**
    Ao realizar uma interpolação, o código definido dentro da mesma será executado como uma função.
    Ou seja: no caso abaixo, eu recebo os props provenientes do Button.tsx.
    A partir dos props, eu corro dentro do objeto e aplico meu valor, repassado pelo componente.
   */
  /* ${(props) => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `
  }} */
`
