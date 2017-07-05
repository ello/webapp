import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { selectDeviceSize } from 'ello-brains/selectors/gui'
import { openModal, closeModal } from 'ello-brains/actions/modals'
import { updateBuyLink } from 'ello-brains/actions/editor'
import {
  ArrowIcon,
  BrowseIcon,
  CameraIcon,
  CheckIconLG,
  MoneyIcon,
  ReplyAllIcon,
  XIcon,
} from '../assets/Icons'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'

import { css, disabled, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.wv40,
  s.hv40,
  s.lh40,
  { borderRadius: 20 },
  s.pr10,
  s.pl15,
  s.overflowHidden,
  { color: 'rgba(255, 255, 255, 0)' },
  s.rightAlign,
  s.nowrap,
  s.alignMiddle,
  s.bgcWhite,
  { transition: `background-color 0.2s ease, color 0.2s ease, width 0.2s ${s.ease}` },
  disabled(s.pointerNone, { opacity: 0.5 }),
  hover({ width: 105 }, s.colorWhite, s.bgcBlack),
  modifier('.forUpload', hover({ width: 110 })),
  modifier('.forPost', hover({ width: 85 })),
  modifier('.forMoney', hover({ width: 85 })),
  modifier('.forComment', hover({ width: 125 })),
  modifier('.forReplyAll', hover({ width: 115 })),
  select('.PostGrid &', { marginRight: -10 }),
  select('.no-touch .PostGrid &:hover', s.wv40),
  select('& + &', { marginLeft: 5 }),
  media('(min-width: 23.4375em)', select('& + &', s.ml10)), // (375 / 16 = 23.4375em)
  media(s.minBreak2, select('& + &', s.ml20)),
)
const labelStyle = css(s.absolute, { left: 20 }, parent('.PostGrid', s.opacity0))
const hide = css(s.hide)

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
          className={classNames('PostActionButton forMoney', { isBuyLinked }, `${buttonStyle}`)}
          disabled={!hasMedia}
          onClick={this.money}
        >
          <span className={labelStyle}>Sell</span>
          <MoneyIcon />
          <CheckIconLG />
        </button>

        <button
          className={`PostActionButton forUpload ${buttonStyle}`}
          onClick={this.browse}
          ref={(comp) => { this.browseButton = comp }}
        >
          <span className={labelStyle}>Upload</span>
          {deviceSize === 'mobile' ? <CameraIcon /> : <BrowseIcon />}
        </button>

        <button className={`PostActionButton forCancel ${buttonStyle}`} onClick={this.cancel}>
          <span className={labelStyle}>Cancel</span>
          <XIcon />
        </button>

        {
          replyAllAction ?
            <button className={`PostActionButton forReplyAll ${buttonStyle}`} onClick={replyAllAction}>
              <span className={labelStyle}>Reply All</span>
              <ReplyAllIcon />
            </button> :
            null
        }

        <button
          className={`PostActionButton for${submitText} ${buttonStyle}`}
          disabled={disableSubmitAction}
          ref={(comp) => { this.submitButton = comp }}
          onClick={this.submitted}
        >
          <span className={labelStyle}>{submitText}</span>
          <ArrowIcon />
        </button>

        <input
          className={hide}
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

