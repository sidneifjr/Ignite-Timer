import { FormContainer, TaskInput, MinutesAmountInput } from './styles'

import { useContext } from 'react'
import { CyclesContext } from '../..'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext() // só funciona se possuirmos o FormProvider, presente em Home.

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        type="text"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        // onChange={(e) => setTask(e.target.value.trim())} // atualiza o estado, a cada letra digitada ou removida.

        /**
         * 1) O "register" é uma função, onde passo um parâmetro para a mesma.
         *
         * 2) Imagine que a função "register" recebe o nome do input e retorna alguns métodos.
         * Tais métodos são os mesmos que utilizamos para trabalhar com inputs no JavaScript. Ou seja, onChange, onBlur, onFocus.
         * Então, nós utilizamos o spread operator para transformar cada um dos métodos presentes do retorno da função "register", em uma propriedade pra meu input.
         *
         * Ou seja, seria quase a mesma coisa que inserir onChange ou outros métodos diretamente.
         */
        {...register('task')}
        /**
         * Boa prática: definir nosso value do input, com o valor do estado. Se nosso estado "task" mudar, por uma origem que não seja a digitação do usuário,
         * eu também quero que o input seja atualizado visualmente, exibindo o novo valor.
         **/
        // value={task}
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
        min={1}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
