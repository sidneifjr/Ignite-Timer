import styled from 'styled-components'

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-weight: bold;
  flex-wrap: wrap;
`

// Estou usando um elemento que possui os estilos compartilhados entre os dois inputs.
// Ou seja, utilizo um componente estilizado de base para criar outros; útil para herança de estilos.
const BaseInput = styled.input`
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: solid 2px ${(props) => props.theme['gray-500']};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`

export const TaskInput = styled(BaseInput)`
  flex: 1; // flex é um shorthand (atalho) para três propriedades: flex-grow, flex-shrink e flex-basis.
  // Flex-grow: "eu dou habilidade para o meu componente crescer além do tamanho original dele, sim ou não?"
  // Flex-shrink: "eu dou habilidade para o meu componente diminuir seu tamanho caso necessário, sim ou não?"
  // Flex-basis: "qual o tamanho ideal do meu elemento?"
  // Ou seja, flex: 1 diz que nosso elemento pode aumentar e diminuir, "fazer o que for possível para caber ali ou ocupar todo o espaço disponível'.

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem;
`
