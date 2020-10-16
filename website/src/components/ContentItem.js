import React      from 'react'
import PropTypes  from 'prop-types'
import classnames from 'classnames'

import ActionItem from './ActionItem'

export default class ContentItem extends React.Component {
  static propTypes = {
    type:            PropTypes.string.isRequired,
    title:           PropTypes.string.isRequired,
    message:         PropTypes.string.isRequired,
    extentedMessage: PropTypes.string.isRequired,
    onClick:         PropTypes.func.isRequired,
    flip:            PropTypes.bool,
    active:          PropTypes.bool.isRequired,
  }

  state = {
    preFlip: false,
    flipped: false,
  }

  handleClick = () => {
    if (this.props.flip) {
      this.setState({ preFlip: true }, () => {
        setTimeout(() => {
          this.setState({ preFlip: false, flipped: !this.state.flipped })
        }, 300)
      })
    } else {
      this.props.onClick()
    }    
  }

  render() {
    const { type, message, extentedMessage, onAttach, active, flip, title } = this.props
    const { preFlip, flipped } = this.state    

    const xmessage = flipped
      ? extentedMessage
      : message
    const xactive  = flip
      ? false
      : active

    const className = classnames('item', { 'pre-flip': preFlip, active: xactive })

    return (
      <div className={className} onClick={this.handleClick} ref={onAttach}>
        <div className="item-content">
          <ActionItem type={type} title={title} message={xmessage} active={xactive} flipped={flipped} />
        </div>
      </div>
    )
  }
}