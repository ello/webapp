import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { LinkIcon } from './EditorIcons'
import { textToolsPath } from '../../networking/api'

function prefixLink(text) {
  const linkPrefix = /((ftp|http|https):\/\/.)|mailto(?=:[-.\w]+@)/
  if (!linkPrefix.test(text)) return `http://${text}`
  return text
}

export default class TextTools extends Component {

  static propTypes = {
    activeTools: PropTypes.object,
    coordinates: PropTypes.object,
    isHidden: PropTypes.bool,
    text: PropTypes.string,
  }

  static defaultProps = {
    isHidden: true,
    activeTools: {
      isBoldActive: false,
      isItalicActive: false,
      isLinkActive: false,
    },
    coordinates: null,
    text: '',
  }

  componentWillMount() {
    const { activeTools, text } = this.props
    const { isBoldActive, isItalicActive, isLinkActive } = activeTools
    this.state = {
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      isBoldActive,
      isItalicActive,
      isLinkActive,
      isLinkInputOpen: false,
      text,
    }
    this.initialValue = text
  }

  handleFocus = () => {
    this.setState({ hasFocus: true })
  }

  handleBlur = () => {
    this.setState({ hasFocus: false })
  }

  handleChange = (e) => {
    const val = e.target.value
    this.setState({
      hasValue: val.length,
      isInitialValue: val === this.initialValue,
      text: val,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { text } = this.state
    this.restoreSelection()
    if (text.length) {
      this.createLink(text)
    } else {
      this.removeLink()
    }
  }

  handleBoldToggle = () => {
    const { isBoldActive } = this.state
    this.setState({ isBoldActive: !isBoldActive })
    document.execCommand('bold', false, true)
    this.saveSelection()
  }

  handleItalicToggle = () => {
    const { isItalicActive } = this.state
    this.setState({ isItalicActive: !isItalicActive })
    document.execCommand('italic', false, true)
    this.saveSelection()
  }

  handleLinkToggle = () => {
    const { isLinkActive, isLinkInputOpen } = this.state
    if (isLinkActive && !isLinkInputOpen) {
      this.removeLink()
    } else {
      this.setState({ isLinkInputOpen: !isLinkInputOpen })
    }
    this.saveSelection()
  }

  createLink(text) {
    this.setState({ isLinkActive: true, isLinkInputOpen: false })
    requestAnimationFrame(() => {
      document.execCommand('createLink', false, prefixLink(text))
      this.saveSelection()
    })
  }

  removeLink() {
    this.setState({ isLinkActive: false, isLinkInputOpen: false, text: '' })
    document.execCommand('unlink', false, null)
    this.saveSelection()
  }

  saveSelection() {
    const sel = window.getSelection()
    if (sel) this.range = sel.getRangeAt(0)
  }

  restoreSelection() {
    if (!this.range) return
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(this.range)
  }

  render() {
    const { isBoldActive, isItalicActive, isLinkActive, isLinkInputOpen, text } = this.state
    const { coordinates, isHidden } = this.props
    const asShowLinkForm = isLinkInputOpen
    const style = coordinates ? { left: coordinates.left, top: coordinates.top - 40 } : null
    return (
      <div
        style={style}
        className={classNames('TextTools', { asShowLinkForm, isHidden })}
      >
        <button
          className={classNames('TextToolButton forBold', { isActive: isBoldActive })}
          onClick={this.handleBoldToggle}
        >
          <strong>B</strong>
        </button>
        <button
          className={classNames('TextToolButton forItalic', { isActive: isItalicActive })}
          onClick={this.handleItalicToggle}
        >
          <em>I</em>
        </button>
        <button
          className={classNames('TextToolButton forLink', { isActive: isLinkActive })}
          onClick={this.handleLinkToggle}
        >
          <LinkIcon />
        </button>
        <form
          action={textToolsPath().path}
          className="TextToolForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.handleSubmit}
        >
          <input
            className="TextToolLinkInput"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            placeholder="Add Link..."
            tabIndex="0"
            type="url"
            value={text}
          />
        </form>
      </div>
    )
  }
}

