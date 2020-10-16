import './styles/message.scss'

import React      from 'react'
import PropTypes  from 'prop-types'
import classnames from 'classnames'
// import SVG        from 'react-inlinesvg'

import AWSCloudImage from '../images/aws-cloud.svg'
import MobImage      from '../images/header-mobile.png'
import UXImagge      from '../images/header-ux.png'
import WebImagge     from '../images/header-web.png'

const MESSAGES = {
  aws: {
    image:        AWSCloudImage,
    title:        'Bring your business to the cloud',
    message:      'Building your application in the cloud has numerous advantages including always-on availability, cost effectiveness and improved security. We will help your utilize all aspects of the cloud to drive revenue, innovation, and increase profitability',
    // shortMessage: 'Scalable, Reliable, Cost Effective',
  },
  web: {
    image:        WebImagge,
    title:        'Build a website that stands out',
    message:      'Tired of slow, poorly protected Wordpress sites? We can help you build fast, reliable and secure web site or web application that is intuitive to use and optimized for delivery around the globe',
    // shortMessage: 'Scalable, Reliable, Cost Effective',
  },
  mob: {
    image:        MobImage,
    title:        'Get a mobile app for your business',
    message:      'Sometimes a website is not enough. Mobile apps allow for better personalization, ease of sending notifications and making use of mobile device features. We can help you design and build a mobile app that fits your business and leaves your customers happy',
  },
  ux: {
    image:        UXImagge,
    title:        'A great product starts with a great UX',
    message:      'The importance of a good user experience and design can not be overstated. The right UI and UX Design help to win the consumers’ confidence and make them use your application or website providing them what they are looking for. We will help you to work out your application information architecture, interaction design, usability and visual design',
  },
}

export default class Message extends React.Component {
  static propTypes = {
    activeService: PropTypes.string.isRequired,
  }

  state = {
    active: true,
    activeService: 'aws',
  }

  render() {
    const { activeService } = this.props

    return (
      <header className="app-message">
        {
          Object.keys(MESSAGES).map((service) => {
            const { image, title, message, shortMessage } = MESSAGES[service]

            const active = activeService === service

            const contentClass = classnames('message-content', { active })            

            return (
              <div className={contentClass} key={service}>
                <div className="image">
                  {/* <SVG src={AWSCloudImage} /> */}
                  <img alt="" src={image} />
                  <div className="cloud-message">{ shortMessage }</div>
                </div>
                <div className="details">
                  <div className="swag-title">
                    { title }
                  </div>
                  <div className="swag-message">
                    { message }
                  </div>
                </div>
              </div>
            )

          })
        }
      </header>
    )
  }
}