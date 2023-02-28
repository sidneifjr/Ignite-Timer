import { createContext, useState } from 'react'

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
  cycles: Cycle[]
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

export function CyclesContextProvider({ children }: ICyclesContextProvider) {
  // Lembrando de definir um valor inicial, com o mesmo tipo que pretendo usar!
  const [cycles, setCycles] = useState<ICycle[]>([])

  // Armazenando o id do ciclo ativo, em um estado.
  // É importante considerar que, ao iniciar a aplicação pela primeira vez, eu posso ter nenhum ciclo cadastrado. Ou seja, o id do ciclo ativo pode ser nulo.
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // Armazena a quantidade de segundos que se passaram, desde que o ciclo foi criado.
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Exibindo, em tela, qual o ciclo ativo; com base no id do ciclo ativo, percorrer todos os ciclos que tenho e retornar qual possui o mesmo id do ciclo ativo.
  // Ou seja: a variável percorre o vetor de ciclos, procurando por um ciclo em que o ID do mesmo seja igual ao ID do ciclo ativo.
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
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
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id) // armazena o id, do ciclo ativo.

    // Para quando eu criar um novo ciclo, limpar quantos segundos se passaram, resetando para zero.
    setAmountSecondsPassed(0)

    // Automaticamente, limpa os campos para o valor original, presente em defaultValues.
    // reset()
  }

  function interruptCurrentCycle() {
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
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null) // interrompe o ciclo atual.
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
