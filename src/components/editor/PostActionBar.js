import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { selectDeviceSize } from '../../selectors/gui'
import {
  BrowseIcon, CheckIcon, CameraIcon, CancelIcon, PostIcon, ReplyAllIcon, MoneyIcon,
} from './EditorIcons'
import { openModal, closeModal } from '../../actions/modals'
import { updateBuyLink } from '../../actions/editor'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'

function mapStateToProps(state) {
  return {
    deviceSize: selectDeviceSize(state),
  }
}

class PostActionBar extends Component {

  static propTypes = {
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool.isRequired,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    hasMedia: PropTypes.bool,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
  }

  static defaultProps = {
    buyLink: null,
    hasMedia: false,
    replyAllAction: null,
  }

  onAddBuyLink = ({ value }) => {
    const { dispatch, editorId } = this.props
    dispatch(updateBuyLink(editorId, value))
    this.onCloseModal()
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  }

  handleFileBrowser = (e) => {
    const { handleFileAction } = this.props
    handleFileAction(e)
    this.fileBrowser.value = ''
  }

  browse = () => {
    this.browseButton.blur()
    this.fileBrowser.click()
  }

  cancel = () => {
    this.props.cancelAction()
  }

  money = () => {
    const { dispatch, buyLink } = this.props
    dispatch(openModal(
      <BuyLinkDialog
        onConfirm={this.onAddBuyLink}
        onDismiss={this.onCloseModal}
        text={buyLink}
      />))
  }

  render() {
    const { deviceSize, disableSubmitAction, hasMedia, replyAllAction, submitText } = this.props
    const isBuyLinked = this.props.buyLink && this.props.buyLink.length
    return (
      <div className="editor-actions">
        <button
          className={classNames('PostActionButton forMoney', { isBuyLinked })}
          disabled={!hasMedia}
          onClick={this.money}
        >
          <span className="PostActionButtonLabel">Sell</span>
          <MoneyIcon />
          <CheckIcon />
        </button>

        <button
          className="PostActionButton forUpload"
          onClick={this.browse}
          ref={(comp) => { this.browseButton = comp }}
        >
          <span className="PostActionButtonLabel">Upload</span>
          {deviceSize === 'mobile' ? <CameraIcon /> : <BrowseIcon />}
        </button>

        <button className="PostActionButton forCancel" onClick={this.cancel}>
          <span className="PostActionButtonLabel">Cancel</span>
          <CancelIcon />
        </button>

        {
          replyAllAction ?
            <button className="PostActionButton forReplyAll" onClick={replyAllAction}>
              <span className="PostActionButtonLabel">Reply All</span>
              <ReplyAllIcon />
            </button> :
            null
        }

        <button
          className={`PostActionButton for${submitText}`}
          disabled={disableSubmitAction}
          ref={(comp) => { this.submitButton = comp }}
          onClick={this.submitted}
        >
          <span className="PostActionButtonLabel">{submitText}</span>
          <PostIcon />
        </button>

        <input
          className="hidden"
          onChange={this.handleFileBrowser}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(PostActionBar)

