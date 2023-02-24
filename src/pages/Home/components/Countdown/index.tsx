import { differenceInSeconds } from 'date-fns'
import { useEffect, useContext } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  // Converte o número de minutos em meu ciclo, inserido pelo usuário, para segundos.
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  /**
   * Criando o intervalo, para o intervalo de início e fim.
   *
   * O activeCycle é uma variável externa ao useEffect. Sempre que utilizarmos uma variável externa, obrigatoriamente devemos incluí-la como uma dependência do useEffect.
   * Isso implica que: toda vez que a variável activeCycle muda, o código será executado novamente.
   *
   * Da forma atual, funciona, mas adicionar um novo ciclo após um pré-existente irá causar bugs.
   */
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        // Digo que o ciclo foi encerrado.
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          // Removendo o intervalo, para que a contagem seja interrompida.
          clearInterval(interval)
        } else {
          // Só atualizo o total de segundos que passou, se eu ainda não "completei o total de segundos"; ou seja, se eu não encerrei um ciclo.
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    /**
     * Com o código acima, criamos um ciclo. Se cadastrarmos um novo ciclo, o anterior continua existindo, fazendo com que ambos os ciclos estejam contando ao mesmo tempo.
     * Através da cleanup function, eu removo o ciclo anterior que já existia, antes de inserir o novo.
     *  */
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ])

  // Quantos segundos já passaram.
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  // Calculando, a partir do total de segundos, quantos minutos eu tenho.
  // Caso retorne um número quebrado (por exemplo, inseri 25 min e já se passou 1s, antes de eu pausar), aproxima para baixo.
  const minutesAmount = Math.floor(currentSeconds / 60)

  // "Ao dividir todos os segundos que tenho, por 60, quantos segundos sobram, que não cabem em mais uma divisão?"
  const secondsAmount = currentSeconds % 60

  // Facilitando a exibição dos números.
  // padStart é um método que preenche aquela string com algum caracter, de forma a atingir um tamanho específico.
  // Eu quero que a variável de minutos sempre possua dois caracteres.
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>
        {/* Pegando a primeira letra da string */}
        {minutes[0]}
      </span>

      <span>{minutes[1]}</span>

      <Separator>:</Separator>

      <span>
        {/* Pegando a primeira letra da string */}
        {seconds[0]}
      </span>

      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
