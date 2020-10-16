import './styles/action-item.scss'

import React      from 'react'
import PropTypes  from 'prop-types'
import classnames from 'classnames'

import awsIcon       from '../images/action-aws.png'
import webIcon       from '../images/action-web.png'
import mobIcon       from '../images/action-mob.png'
import uxIcon        from '../images/action-ux.png'
import activeAwsIcon from '../images/action-aws-active.png'
import activeWebIcon from '../images/action-web-active.png'
import activeMobIcon from '../images/action-mob-active.png'
import activeUxIcon  from '../images/action-ux-active.png'


const typeIconMapping = {
  aws: {
    normal: awsIcon,
    active: activeAwsIcon,
  },
  web: {
    normal: webIcon,
    active: activeWebIcon,
  },
  mob: {
    normal: mobIcon,
    active: activeMobIcon,
  },
  ux: {
    normal: uxIcon,
    active: activeUxIcon,
  }
}

export default class ActionItem extends React.Component {
  static propTypes = {
    type:    PropTypes.string.isRequired,
    title:   PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    active:  PropTypes.bool.isRequired,
    flipped: PropTypes.bool.isRequired,
  }

  render() {
    const { type, message, active, title, flipped } = this.props

    const mapping = typeIconMapping[type]
    const icon    = active
      ? mapping.active
      : mapping.normal
    const imageClass = classnames('type', { flipped })

    return (
      <div className="action-item">
        <div className="images">

          <div className="image">
            <img className={imageClass} alt="" src={icon} />
          </div>    
 
          <div className="shadow" />
        </div>
        
        <div className="messages">
          <div className="title">{ title }</div>
          { message }
        </div>
      </div>
    )
  }
}