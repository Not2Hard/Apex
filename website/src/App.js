import './styles/app.scss'

import React from 'react'

import Header    from './components/Header'
import Message   from './components/Message'
import Content   from './components/Content'
import EmailForm from './components/EmailForm'

export default class App extends React.Component {
  state = {
    activeService: 'aws',
  }

  handleItemActivated = (item) => {
    if (item !== this.state.activeService) {
      this.setState({ activeService: item })
    }
  }
  
  render() {
    const { activeService } = this.state    

    return (
      <div className="app">
        <Header />
        <Message activeService={activeService} />        
        <Content onItemActivated={this.handleItemActivated} activeService={activeService} />
        <EmailForm />
      </div>
    )
  }
}
