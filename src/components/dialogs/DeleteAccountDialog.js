import React, { Component, PropTypes } from 'react'

class DeleteAccountDialog extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      scene: 'renderConfirm',
    }
    this.counter = 5
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onClickJustKidding = () => {
    this.props.onDismiss()
  }

  onClickNotKidding = () => {
    this.props.onConfirm()
  }

  onClickConfirm = () => {
    this.setState({ scene: 'renderConfirmReally' })
  }

  onClickConfirmReally = () => {
    this.setState({ scene: 'renderCountdown' })
    this.interval = setInterval(() => {
      this.counter -= 1
      this.counterEl.innerHTML = this.counter
      if (this.counter === 0) {
        this.onClickNotKidding()
      }
    }, 1000)
  }

  renderConfirm() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Delete account?</h2>
        <button className="ConfirmDialogButton" onClick={this.onClickConfirm}>Yes</button>
        <button className="ConfirmDialogButton" onClick={this.onClickJustKidding}>No</button>
      </div>
    )
  }

  renderConfirmReally() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Are you sure?</h2>
        <button className="ConfirmDialogButton" onClick={this.onClickConfirmReally}>Yes</button>
        <button className="ConfirmDialogButton" onClick={this.onClickJustKidding}>No</button>
        <p>
          * By deleting your account you remove your personal information from
          Ello. Your account cannot be restored.
        </p>
      </div>
    )
  }

  renderCountdown() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>
          <span>You will be redirected in </span>
          <span ref={(comp) => { this.counterEl = comp }}>{this.counter}</span>
          <span> ...</span>
        </h2>
        <button
          className="ConfirmDialogButton"
          onClick={this.onClickJustKidding}
          style={{
            display: 'block',
            position: 'absolute',
            width: `${100}%`,
            height: `${40 / 16}rem`,
            borderRadius: `${20 / 16}rem`,
            marginTop: `${40 / 16}rem`,
          }}
        >
          Cancel!
        </button>
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

export default DeleteAccountDialog

