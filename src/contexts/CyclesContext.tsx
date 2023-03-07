/**
 * Assim como o state, o Reducer serve para armazenar informações e alterá-las no futuro.
 * Devemos ter preferência ao uso de Reducers quando queremos armazenar informações mais complexas, especialmente quando precisamos alterá-las.
 *
 * Por exemplo, alterar o array de ciclos em interruptCurrentCycle é um processo custoso, com muitas operações.
 *
 * "As alterações que eu faço em algum estado da minha aplicação, que geralmente dependem da versão anterior do mesmo e essa operações são normalmente
 * onerosas/custosas (basntae cálculo ou operações), são casos em que fazem sentido criar um reducer. Pois assim conseguimos abstrair o nosso código e
 * torná-lo mais simples de utilizar e também desacoplar essa lógica. Assim, se precisarmos interromper a ação do usuário, não seria necessário
 * copiar o mesmo para vários arquivos da aplicação"
 *
 * "Com o reducer, teríamos um local fixo onde todas as operações poderiam acontecer dentro de um estado do nosso componente".
 */
import { createContext, ReactNode, useReducer, useState } from 'react'

/*
 O valor que você define como o intervalo de tempo em um setInterval ou setTimeout não é preciso: é apenas uma estimativa.

 Os seguintes fatores podem interferir:

 - Aba do navegador em background;
 - Lentidão do sistema;

 Ou seja: 1s não é o valor exato. É perfeitamente possível que o timer não fique correto.

 Portanto, outra forma de tratar do countdown: 

 Ao criar o ciclo, onde criamos nossa interface Cycle (com id, task e minutesAmount), podemos adicionar um startDate.
 Assim, temos a data em que ele se tornou ativo e, com base nessa data, podemos saber quanto tempo passou.
*/

// Mesmos tipos que os usados em "NewCycleFormData", em Home.
interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface ICycle {
  id: string // necessário para representar cada ciclo unicamente.
  task: string
  minutesAmount: number
  startDate: Date // Date é um método nativo do JavaScript!
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICyclesContext {
  cycles: ICycle[]
  activeCycle: ICycle | undefined // undefined pois, quando o usuário não iniciar nenhum ciclo, não será possível encontrar nenhum ciclo ativo.
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

// "activeCycle" é utilizado em ambos Countdown e NewCycleForm.
// Lembrando que é a tipagem que permite a inteligência de reconhecer os valores a serem utilizados (exibidos com CTRL + espaço).
export const CyclesContext = createContext({} as ICyclesContext)

interface ICyclesContextProvider {
  children: ReactNode // sempre usado para "children" de um componente. Representa "qualquer JSX ou HTML válido".
}

interface CyclesState {
  cycles: ICycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({ children }: ICyclesContextProvider) {
  // Lembrando de definir um valor inicial, com o mesmo tipo que pretendo usar!
  /**
   * Um useReducer recebe dois parâmetros: uma função e qual o valor da minha variável inicial de cycles.
   *
   * A função recebe dois parâmetros:
   *
   * 1) state (valor atual, em tempo real, da nossa variável cycles)
   * 2) action (qual ação o usuário pretende realizar para alteração dentro de nossa variável).
   * É algo único que indica a ação que o usuário quer fazer para alterar nosso estado.
   *
   * Por exemplo: posso ter uma ação de interrupt, para interromper meu ciclo. Uma ação de add, para adicionar ao meu ciclo.
   * Ou seja, são ações que o usuário pode realizar para alterar nosso estado.
   *
   * O setCycles será a função que irá disparar a ação, ou seja, não é mais a função que altera diretamente o valor de cycles.
   * Então, é mais apropriado alterarmos o nome da função para "dispatch". Pois estamos disparando uma ação.
   *  */

  /**
   * Quando utilizamos um reducer, não há obrigatoriedade de salvar somente uma informação dentro do mesmo (no caso, a lista de ciclos).
   * Eu posso salvar várias informações.
   *
   *
   */
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      /**
       * Se o action.type for igual ao valor definido, ao invés de simplesmente retornar o state sem alterações,
       * irei retornar um novo array copiando meu state e adicionando, ao final, meu valor passado ao payload (no caso, newCycle será a variável repassada  e adicionada).
       */
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }

        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }

        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }

        default:
          return state
      }
    },
    // Definindo valores iniciais para nosso estado.
    {
      cycles: [],
      activeCycleId: null,
    },
  )

  // Armazena a quantidade de segundos que se passaram, desde que o ciclo foi criado.
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  // Exibindo, em tela, qual o ciclo ativo; com base no id do ciclo ativo, percorrer todos os ciclos que tenho e retornar qual possui o mesmo id do ciclo ativo.
  // Ou seja: a variável percorre o vetor de ciclos, procurando por um ciclo em que o ID do mesmo seja igual ao ID do ciclo ativo.
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
  }

  function createNewCycle(data: CreateCycleData) {
    console.log(data)

    // Obtém a data atual, convertida para millisegundos. Assim, é humanamente impossível ocorrer IDs repetidos.
    const id = String(new Date().getTime())

    const newCycle: ICycle = {
      id, // é o mesmo que definir "id: id"
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    /**
     * Para copiar todos os ciclos que já possuo e adicionando um novo ciclo, ao final:
     * setCycles([...cycles, newCycle])
     *
     * Porém, uma regra associada a closures, no React: toda vez que eu estou alterando um estado e esse estado depende da sua versão ou informação anterior,
     * é uma boa idéia que tal valor seja setado em formato de arrow function.
     *
     * Assim: eu pego o estado atual da minha variável de ciclos, copio o estado atual e adiciono o novo ciclo no final.
     **/
    // setCycles((state) => [...state, newCycle])

    /**
     * Dentro de nosso dispatch, eu preciso enviar algum informação que me permite distinguir uma ação da outra.
     * O valor que eu passar para o meu dispatch, ocupará o lugar da action.
     *
     * Por exemplo, se eu usar "dispatch(newCycle)", eu terei o novo ciclo que quero adicionar.
     *
     * Mas e se também usar um "dispatch(activeCycleId)" dentro de interruptCurrentCycle, eu estaria fazendo com que minha função recebesse ambos
     * os valores, porém sem ter uma forma de distinguir quando eu estaria adicionando um novo ciclo ou quando estaria interrompendo.
     *
     * Então, ao invés de enviar somente a ação "crua", eu envio um objeto com um 'type' (onde digo qual ação eu quero realizar)
     * e um payload, onde envio os dados do meu novo ciclo.
     */
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    // Para quando eu criar um novo ciclo, limpar quantos segundos se passaram, resetando para zero.
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })

    /**
     * 1) Eu vou percorrer todos os ciclos.
     *
     * 2) Para cada ciclo que estou percorrendo: se o ciclo for o ciclo ativo, eu vou retornar todos os dados do ciclo. Porém, também adiciono
     * uma nova informação (InterruptedDate), como sendo a data atual.
     *
     * 3) Se não for o atual, retorno o ciclo sem alterações.
     *
     * É importante lembrar que nunca podemos alterar uma informação, sem seguir os princípios da imutabilidade.
     */
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
