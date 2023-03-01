import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'

// Hooks são funções que possuem o prefixo, "use" e acoplam uma funcionalidade em um componente existente (ex.: useState, useEffect, useReducer, etc.).
import { FormProvider, useForm } from 'react-hook-form'

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
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'

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
    .min(1, 'O ciclo precisa ser de, no mínimo, 5 minutos')
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
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // Retorna um objeto, com vários funções e variáveis disponíveis; portanto, destruturação é útil.
  // "useForm" cria um novo formulário em minha aplicação. "Register" é um método que irá adicionar um input ao nosso formulário, dizendo quais campos terei no mesmo.
  // Na função "useForm()", iremos passar um objeto de configuração; a intenção é "utilizar um resolver de validação, o zodResolver".
  // const { register, handleSubmit, watch, formState, reset } =
  const newCycleForm = useForm<NewCycleFormData>({
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

  const { handleSubmit, watch, /* formState */ reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  // É interessante notar que, ao realizarmos um console.log em nossa aplicação, o log é exibido duas vezes:
  // 1 é proveniente do nosso arquivo e o outro é proveniente do "react_devtools_backend.js".
  // Isso ocorre SOMENTE em desenvolvimento, não afeta produção; é relacionado ao StrictMode no React, definido no main.tsx.
  console.log(activeCycle)

  // formState permite retornar o estado do formulário, inclusive os erros quando existem.
  // console.log(formState.errors)

  // Ao monitorar um campo específico, consigo visualizar o valor do mesmo em tempo real. Isso transforma nosso formulário em controlled!
  const task = watch('task')
  const isSubmitDisabled = !task

  /**
   * Prop Drilling
   *
   * É quando possuímos MUITAS propriedades APENAS para comunicação entre componentes; comum quando queremos passar propriedades para componentes filhos da árvore.
   * Uma forma de resolver é utilizando a Context API: a mesma permite compartilharmos informações entre vários componentes, ao mesmo tempo.
   */
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/**
         * Com o spread operator abaixo, estou obtendo todas as propriedades do objeto "newCycleForm" e passo como uma propriedade para o componente "FormProvider".
         * A intenção é reduzir repetição. Sem o spread operator, eu faria o seguinte:
         *
         * <FormProvider register={register} formState={formState}> e etc.
         */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {/**
         * O "!task.length" (ou task === ') indica "somente quando o input estiver vazio".
         *
         * Agora, eu preciso habilitar o botão de submit, baseado se a informação de task estará preenchida ou não.
         * A função "watch" do useForm permite observar o campo desejdao.
         */}

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
