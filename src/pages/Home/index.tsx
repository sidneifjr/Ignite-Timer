import { Play } from 'phosphor-react'
import { useState } from 'react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

/**
 * Ao tratar de formulários no React (e qualquer outro cenário que envolve input do usuário), temos dois modelos de trabalho em nossa aplicação:
 *
 * 1) Controlled
 *
 * É quando nós mantemos, em tempo real, a informação que o usuário insere na aplicação; a mesma é armazenada dentro do estado, em uma variável no nosso componente.
 * Então, toda vez que o usuário alterar a informação, o estado será atualizado com o novo valor.
 *
 * Ou seja: é a monitoração de cada alteração e salvar a informação em meu estado.
 *
 * Monitorar as alterações do usuário, em tempo real, permite muita fluidez para exibir as alterações de informações do usuário.
 *
 * Porém, toda vez que ocorre uma atualização de estado, ocorre uma nova renderização do componente inteiro. Ou seja, o componente é recalculado.
 * Em interfaces muito complexas, é possível que afete a performance.
 *
 * Então, é mais apropriado para formulários pequenos (login, cadastro, etc.), com poucos campos e interface simples.
 *
 * 2) Uncontrolled
 *
 * Nós buscamos pela informação do valor no input, APENAS quando precisarmos dela.
 *
 * Porém, perdemos a fluidez. Não temos acesso ao valor digitado letra por letra, mas ganhamos em performance.
 *
 * Assim, eu aplicaria um "onSubmit={handleSubmit}" no elemento form.
 *
 * const handleSubmit = (event) => {
 *   event.target.task.value
 * }
 *
 * Portanto, tal modelo é útil quando possuímos uma grande quantidade de inputs.
 *
 */

export function Home() {
  const [task, setTask] = useState('')

  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            name="task"
            type="text"
            placeholder="Dê um nome para o seu projeto"
            onChange={(e) => setTask(e.target.value.trim())} // atualiza o estado, a cada letra digitada ou removida.
            /**
             * Boa prática: definir nosso value do input, com o valor do estado. Se nosso estado "task" mudar, por uma origem que não seja a digitação do usuário,
             * eu também quero que o input seja atualizado visualmente, exibindo o novo valor.
             **/
            value={task}
          />

          {/* Um datalist nada mais é do que uma lista de sugestões para um input. */}
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        {/* O "!task.length" (ou task === ') indica "somente quando o input estiver vazio". */}
        <StartCountdownButton disabled={!task.length} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
