import React, { Component, PropTypes } from 'react'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import TextControl from '../forms/TextControl'
import { isValidURL } from '../forms/Validators'

class BuyLinkDialog extends Component {

  componentWillMount() {
    this.value = this.props.text
    this.state = { status: STATUS.INDETERMINATE }
    this.updateStatus({ buyLink: this.value || '' })
  }

  onClickSubmit = () => {
    if (this.value.indexOf('http') !== 0) {
      this.value = `http://${this.value}`
    }
    this.props.onConfirm({ value: this.value })
  }

  onClickReset = () => {
    this.props.onConfirm({ value: null })
  }

  onChangeControl = ({ buyLink }) => {
    this.updateStatus({ buyLink })
    this.value = buyLink
  }

  updateStatus({ buyLink }) {
    const isValid = isValidURL(buyLink)
    const { urlStatus } = this.state
    if (isValid && urlStatus !== STATUS.SUCCESS) {
      this.setState({ urlStatus: STATUS.SUCCESS })
    } else if (!isValid && urlStatus !== STATUS.INDETERMINATE) {
      this.setState({ urlStatus: STATUS.INDETERMINATE })
    }
  }

  render() {
    const { onDismiss, text } = this.props
    const { urlStatus } = this.state
    return (
      <div className="Dialog BuyLinkDialog">
        <h2 className="BuyLinkDialogTitle">Sell your work</h2>
        <TextControl
          autoFocus
          classList="isBoxControl BuyLinkDialogControl"
          id="buyLink"
          name="buy[productDetail]"
          onChange={this.onChangeControl}
          placeholder="Product detail URL"
          status={urlStatus}
          tabIndex="1"
          text={text}
        />
        <button
          className="BuyLinkDialogButton isSubmit"
          onClick={this.onClickSubmit}
          disabled={!(urlStatus === STATUS.SUCCESS)}
        >
          {text && text.length ? 'Update' : 'Submit'}

        </button>
        {text && text.length ?
          <button
            className="BuyLinkDialogButton isRemove"
            onClick={this.onClickReset}
          >
            Remove
          </button> :
          null
        }
        <button className="BuyLinkDialogButton" onClick={onDismiss}>Cancel</button>
      </div>
    )
  }
}

BuyLinkDialog.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  text: PropTypes.string,
}
BuyLinkDialog.defaultProps = {
  text: null,
}

export default BuyLinkDialog

