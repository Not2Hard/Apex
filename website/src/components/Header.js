import './styles/header.scss'

import React from 'react'
import logo  from '../images/apexquest_logo.png'

export default class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <img alt="apexquest" src={logo}></img>
      </header>
    )
  }
}