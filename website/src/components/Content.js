import './styles/content.scss'

import React      from 'react'
import PropTypes  from 'prop-types'
import Muuri      from 'muuri'
import classnames from 'classnames'

import ContentItem from './ContentItem'

const actionItems = [
  {
    type:            'aws',
    title:           'Bring your business to the cloud',
    message:         'Using latest cutting-edge cloud technologies, we can help you build cost-effective and highly-resilient solutions of any scale',
    extentedMessage: 'Building your application in the cloud has numerous advantages including always-on availability, cost effectiveness and improved security. We will help your utilize all aspects of the cloud to drive revenue, innovation, and increase profitability',
  },
  {
    type:            'web',
    title:           'Build a website that stands out',
    message:         'Whether it’s a simple yet elegant website, or a most sophisticated web application, we can help you design and build it leveraging latest web technologies', 
    extentedMessage: 'Tired of slow, poorly protected Wordpress sites? We can help you build fast, reliable and secure web site or web application that is intuitive to use and optimized for delivery around the globe',
  },
  {
    type:            'mob',
    title:           'Get a mobile app for your business',
    message:         'Want a mobile application to facilitate you business even further? Get in touch with us for a great multi-platform mobile app that will help you get ahead of your competitors',
    extentedMessage: 'Sometimes a website is not enough. Mobile apps allow for better personalization, ease of sending notifications and making use of mobile device features. We can help you design and build a mobile app that fits your business and leaves your customers happy',
  },
  {
    type:            'ux',
    title:           'A great product starts with a great UX',
    message:         'We can help you turn your great ideas into successful digital products that you and your customers would love', 
    extentedMessage: 'The importance of a good user experience and design can not be overstated. The right UI and UX Design help to win the consumers’ confidence and make them use your application or website providing them what they are looking for. We will help you to work out your application information architecture, interaction design, usability and visual design',
  },
]

export default class Content extends React.Component {
  static propTypes = {
    onItemActivated: PropTypes.func.isRequired,
    activeService:   PropTypes.string.isRequired,
  }

  state = {
    offset: 0,
    initted: false,
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)

    // setTimeout(() => {
    //   setTimeout(() => {
    //     this.setState({ initted: true })
    //   }, 1000)
    // }, 0)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    if (this.ref) {
      const containerBounds = this.ref.getBoundingClientRect()      
      
      const containerWidth = containerBounds.width //- 2 * 50 // paddings
      const itemWidth      = this.itemWidth //+ 2 * 10        // margins

      if (itemWidth > 0) {
        const nItems = Math.floor(containerWidth / itemWidth)
        const offset = (containerWidth - nItems * itemWidth) / 2

        this.setState({ offset })
      }
    }
  }

  handleAttach = (ref) => {
    if (ref && !this.ref) {
      this.ref = ref      

      this.muuri = new Muuri('.grid', { layoutOnResize: 200, layoutOnInit: true })
      setTimeout(() => {
        this.muuri = new Muuri('.grid', { layoutOnResize: 200, layoutOnInit: true })
        this.setState({ initted: true })
      }, 1000)
    }
  }

  handleItemAttach = (ref) => {
    if (ref) {
      const itemWidth = ref.getBoundingClientRect().width
      
      if (itemWidth > 0) {
        if (!this.itemWidth || Math.abs(this.itemWidth - itemWidth) > 5) {
          this.itemWidth = itemWidth
          this.handleResize()
        }
      }
    }
  }

  renderItem = (type, title, message, extentedMessage, flip) => {
    const onItemActivated = () => this.props.onItemActivated(type)

    const active = type === this.props.activeService

    return (
      <ContentItem
        key={type}
        flip={flip}
        type={type}
        active={active}
        title={title}
        message={message}
        extentedMessage={extentedMessage}
        onClick={onItemActivated}
        onAttach={(ref) => this.handleItemAttach(ref)}
       />
    )
  }

  render() {
    const { initted, offset } = this.state

    const style = {
      transform: `translateX(${offset}px)`,
      transition: initted ? '.4s' : 0,
    }

    const className = classnames('app-content', { initted })

    return (
      <div className={className} ref={ref => { this.handleAttach(ref) }}>
        <div className="grid" style={style}>
          {
            actionItems.map(({ message, type, title, extentedMessage }) => {
              return this.renderItem(type, title, message, extentedMessage, false)  
            })
          }
        </div>
        <div className="grid-sm">
          {
            actionItems.map(({ message, type, title, extentedMessage }) => {
              return this.renderItem(type, title, message, extentedMessage, true)
            })
          }
        </div>
      </div>
    )
  }
}