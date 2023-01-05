import { Play } from 'phosphor-react'

// Hooks são funções que possuem o prefixo, "use" e acoplam uma funcionalidade em um componente existente (ex.: useState, useEffect, useReducer, etc.).
import { useForm } from 'react-hook-form'

/**
 * - Zod é uma biblioteca de validação que possui integração com TypeScript.
 * Em relação a semelhantes, possui um pouco mais de intellisense onde, por exemplo, evita validar campos que não existem.
 *
 * - "hookform/resolvers" é uma biblioteca usada para integrar o Zod com o react-hook-form.
 *
 * - O Zod não possui um export default; ou seja, eu teria que importar cada função do Zod separadamente.
 * Ou eu posso usar uma técnica para tal: "importando tudo e dando o nome para isso aqui".
 *  */
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

/**
 * Schema de validação, onde eu digo "de que forma eu quero validar os dados nos meus inputs", seguindo um formato.
 *
 * - Por exemplo:
 *
 * "minha task é obrigatória e deve possuir, pelo menos, cinco caracteres."
 * "meu MinutesAmountInput precisa ser múltiplo de cinco, ter o valor máximo e mínimo como x e y."
 *
 * No caso abaixo, em handleCreateNewCycle, eu estou validando um objeto; portanto, devo usar o método object.
 **/
const newCycleFormValidationSchema = zod.object({
  // A validação do task será: "eu quero que este campo seja, obrigatoriamente, uma string com um caracter no mínimo".
  // E, se a pessoa não informar esse caractere, exibe a mensagem 'Informe a tarefa'. Ou seja, retorna uma mensagem, quando o valor do campo for inválido.
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de, no mínimo, 5 minutos')
    .max(60, 'O ciclo precisa ser de, no máximo, 60 minutos'),
})

/**
 * É possível obter as tipagens de um objeto, através da função 'infer' disponibilizada pelo TypeScript.
 * Quando eu digo "Inferir", estou automatizando um processo de falar qual é a tipagem de algo.
 *
 * Porém, é importante notar que não posso utilizar uma variável JavaScript dentro do TypeScript. Ou seja, é necessário converter para algo específico ao TypeScript.
 * Sempre que eu preciso referenciar uma variável JavaScript dentro do TypeScript, eu preciso usar o typeof antes dela.
 *
 * Assim, o processo de inclusão de novos campos é automatizado: não é necessário definir-los manualmente em uma interface.
 */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  // const [task, setTask] = useState('')

  // Retorna um objeto, com vários funções e variáveis disponíveis; portanto, destruturação é útil.
  // "useForm" cria um novo formulário em minha aplicação. "Register" é um método que irá adicionar um input ao nosso formulário, dizendo quais campos terei no mesmo.
  // Na função "useForm()", iremos passar um objeto de configuração; a intenção é "utilizar um resolver de validação, o zodResolver".
  const { register, handleSubmit, watch, formState } =
    useForm<NewCycleFormData>({
      /**
       * Passo o schema como o formato a ser utilizado na validação.
       * Então, se a validação funcionar, tudo ocorrerá normalmente. Porém, se houver algum erro, a execução será interrompida.
       */
      resolver: zodResolver(newCycleFormValidationSchema),

      // Definindo o valor inicial de cada campo.
      // Ao usar um generic em "useForm", podemos fazer com que o intellisense da ferramenta reconheça os valores existentes (ao apertar CTRL + espaço).
      defaultValues: {
        task: '',
        minutesAmount: 0,
      },
    })

  function handleCreateNewCycle(data: INewCycleFormData) {
    console.log(data)
  }

  // formState permite retornar o estado do formulário, inclusive os erros quando existem.
  console.log(formState.errors)

  // Ao monitorar um campo específico, consigo visualizar o valor do mesmo em tempo real. Isso transforma nosso formulário em controlled!
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            type="text"
            placeholder="Dê um nome para o seu projeto"
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
            min={5}
            {...register('minutesAmount', { valueAsNumber: true })}
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
        {/**
         * Agora, eu preciso habilitar o botão de submit, baseado se a informação de task estará preenchida ou não.
         * A função "watch" do useForm permite observar o campo desejdao.
         */}
        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
