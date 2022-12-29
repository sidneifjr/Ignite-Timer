import { HeaderContainer } from './styles'
import { Timer, Scroll } from 'phosphor-react'

import logoIgnite from '../../assets/logo-ignite.svg'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      {/*
       Caso não seja possível descrever o conteúdo da imagem, é melhor deixar o alt vazio do que inserir qualquer coisa.
       Como li em outro lugar: "É melhor não ter acessibilidade, do que ter a mesma implementada de forma errônea".
      */}
      <img src={logoIgnite} alt="" />

      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24}></Timer>
        </NavLink>

        <NavLink to="/history" title="History">
          <Scroll size={24}></Scroll>
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
