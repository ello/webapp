import React, { Component, PropTypes } from 'react'
import FormControl from '../forms/FormControl'
import { SVGIcon } from '../svg/SVGComponents'

export default class MessageDialog extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    titlePrefix: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.state = { isValid: false, scene: 'renderCompose' }
    this.messageValue = ''
  }

  onChangeMessageControl = ({ message }) => {
    this.messageValue = message
    this.updateFormState()
  }

  onConfirm = () => {
    this.props.onConfirm({
      message: this.messageValue,
    })
    this.setState({ scene: 'renderSent' })
  }

  updateFormState() {
    const { isValid } = this.state
    if (!isValid && this.messageValue.length) {
      this.setState({ isValid: true })
    } else if (isValid && !this.messageValue.length) {
      this.setState({ isValid: false })
    }
  }

  renderCompose() {
    const { name, onDismiss, titlePrefix } = this.props
    const { isValid } = this.state
    return (
      <div className="Dialog MessageDialog">
        <h2 className="MessageDialogTitle">{`${titlePrefix} ${name}`}</h2>
        <form
          className="MessageForm"
          id="MessageForm"
          noValidate="novalidate"
          onSubmit={this.onConfirm}
          role="form"
        >
          <FormControl
            classList="MessageMessageControl isBoxControl"
            id="message"
            kind="textarea"
            label="Message"
            name="message[message]"
            onChange={this.onChangeMessageControl}
            placeholder="Message"
            tabIndex="2"
          />
        </form>
        <button
          className="MessageDialogButton isConfirmButton"
          disabled={!isValid}
          onClick={this.onConfirm}
        >
          Submit
        </button>
        <button
          className="MessageDialogButton isDismissButton"
          onClick={onDismiss}
        >
          Cancel
        </button>
      </div>
    )
  }

  renderSent() {
    const { name, onDismiss } = this.props
    return (
      <div className="Dialog MessageDialog">
        <h2 className="MessageDialogTitle">
          <SVGIcon className="MessageDialogSuccessIcon">
            <g>
              <polyline points="4.8,10.8 9.9,17 17.2,5" />
            </g>
          </SVGIcon>
          <span>{`Email sent to ${name}`}</span>
        </h2>
        <button
          className="MessageDialogButton isOkayButton"
          onClick={onDismiss}
        >
          Okay
        </button>
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

