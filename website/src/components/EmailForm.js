import './styles/email-form.scss'

import React      from 'react'
import classnames from 'classnames'

const BASE_URL = 'https://dvqbc8vlwb.execute-api.us-west-2.amazonaws.com/test'

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function validatePhone(phone) {
  const phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/
  const digits = phone.replace(/\D/g, "")
  return phoneRe.test(digits)
}

function handleRequest(data) {  
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then((result) => {
      if (result.success) {
        resolve()
      } else {
        reject()
      }
    }).catch((error) => {
      reject()
    })
  })
}

const defaultState = {
  name:    '',
  phone:   '',
  email:   '',
  message: '',
  progress: false,
  errors: {},
  success: false, 
}

export default class EmailForm extends React.Component {
  state = {
    ...defaultState
  }

  handleName = (event) => {
    this.handleChange(event, 'name')
  }

  handlePhone = (event) => {
    this.handleChange(event, 'phone')
  }

  handleEmail = (event) => {
    this.handleChange(event, 'email')
  }

  handleMessage = (event) => {
    this.handleChange(event, 'message')
  }

  handleChange = (event, propName) => {
    this.setState({ [propName]: event.currentTarget.value })
  }
  
  handleSubmit = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const errors   = this.validate()
    const noErrors = Object.keys(errors).length === 0

    if (noErrors) {
      const { name, phone, email, message } = this.state

      this.setState({ progress: true, errors }, () => {
        handleRequest({ name, phone, email, message }).then(() => {
          this.setState({ success: true }, () => {
            setTimeout(() => {
              this.setState({ success: false }, () => {
                setTimeout(() => {
                  this.setState({ ...defaultState })
                }, 750)
              })
            }, 1000)
          })
      
        }).catch((error) => {
          this.setState({ progress: false })
        })
      })  
    } else {
      this.setState({ errors })
    }
  }

  validate = () => {
    const { name, email, phone, message } = this.state

    const errors = {}
  
    if (name.trim().length === 0) {
      errors.name = 'Please, specify your name'
    }
    if (!validateEmail(email)) {
      errors.email = 'Please, enter a valid e-mail address'
    }
    if (!validatePhone(phone)) {
      errors.phone = 'Please, enter a valid phone number' // "415-555-1212"
    }
    if (message.trim().length === 0) {
      errors.message = 'Please, write us a message'
    }
  
    return errors
  }
  

  render() {
    const { name, phone, email, message, progress, errors, success } = this.state

    const statusClass    = classnames('status', { success } )
    const formClass      = classnames('ui form', { progress } )
    const progressClass  = classnames('progress-indicator', { progress })

    const nameClass      = classnames('field', { error: 'name'    in errors })
    const phoneClass     = classnames('field', { error: 'phone'   in errors })
    const emailClass     = classnames('field', { error: 'email'   in errors })
    const messageClass   = classnames('field message', { error: 'message' in errors })

    return (
      <div className="email-form">
        <div className={statusClass}></div>

        <div className="contact-us">
          <h4 className="ui dividing header">Contact us</h4>
          <div className="phone">+1 (678) 447-8826</div>
        </div>        

        <form className={formClass}>
          {/* <div className="fields"> */}
            <div className={nameClass}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={this.handleName}
              />
            </div>
            <div className={phoneClass}>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                placeholder="Phone"
                value={phone}
                onChange={this.handlePhone}
              />
            </div>
          {/* </div> */}

          <div className={emailClass}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleEmail}
              placeholder="Email"
            >
            </input>
          </div>

          <div className={messageClass}>
            <textarea
              rows="7"
              placeholder="Message"
              value={message}
              onChange={this.handleMessage}
            />
          </div>

          <div className="actions field">
            <button className="ui button" onClick={this.handleSubmit}>Send</button>
          </div>
        </form>

        <div className={progressClass} />
      </div>
    )
  }
}
