import React, { Component, PropTypes } from 'react'
import trim from 'lodash/trim'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { RequestIcon, SuccessIcon, FailureIcon } from '../forms/FormIcons'

class FormControl extends Component {

  static propTypes = {
    classList: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.object,
    id: PropTypes.string.isRequired,
    kind: PropTypes.string,
    label: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    renderStatus: PropTypes.func,
    renderFeedback: PropTypes.func,
    status: PropTypes.string,
    trimWhitespace: PropTypes.bool,
    text: PropTypes.string,
  }

  static defaultProps = {
    classList: null,
    className: null,
    icon: null,
    kind: 'input',
    label: null,
    onBlur: null,
    onChange: null,
    onFocus: null,
    renderStatus: null,
    renderFeedback: null,
    status: STATUS.INDETERMINATE,
    tabIndex: '0',
    text: '',
    trimWhitespace: false,
    type: 'text',
  }

  componentWillMount() {
    const { text } = this.props
    this.state = {
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      text,
    }
    this.initialValue = text
  }

  componentDidMount() {
    this.timer = setTimeout(this.checkValue, 250)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  onFocusControl = (e) => {
    this.setState({ hasFocus: true })
    const { onFocus } = this.props
    if (typeof onFocus === 'function') {
      onFocus(e)
    }
  }

  onBlurControl = (e) => {
    this.setState({ hasFocus: false })
    const { onBlur } = this.props
    if (typeof onBlur === 'function') {
      onBlur(e)
    }
  }

  onChangeControl = (e) => {
    const target = e.target
    let value = target.value
    if (this.props.trimWhitespace && /\s/.test(value)) {
      value = trim(value)
      target.value = value
    }
    this.onChangeValue(value)
  }

  onChangeValue = (val) => {
    const { id, onChange } = this.props
    this.setState({
      text: val,
      hasValue: val.length,
      isInitialValue: val === this.initialValue,
    })
    if (id && typeof onChange === 'function') {
      onChange({ [id]: val })
    }
  }

  getStatusAsClassName() {
    const { status } = this.props
    switch (status) {
      case STATUS.REQUEST:
        return 'isValidating'
      case STATUS.FAILURE:
        return 'isFailing'
      case STATUS.SUCCESS:
        return 'isSucceeding'
      case STATUS.INDETERMINATE:
      default:
        return 'isIndeterminate'
    }
  }

  getGroupClassNames() {
    const { classList, className } = this.props
    const { hasFocus, hasValue, isInitialValue } = this.state
    const statusClassName = this.getStatusAsClassName()
    return classNames(
      'FormControl',
      classList,
      className,
      statusClassName,
      { hasFocus },
      { hasValue },
      { isInitialValue },
    )
  }

  getLabelClassNames() {
    const { classList } = this.props
    return classNames('FormControlLabel', classList)
  }

  getInputClassNames() {
    const { classList } = this.props
    return classNames('FormControlInput', classList)
  }

  getStatusClassNames() {
    const { classList } = this.props
    return classNames('FormControlStatus', classList)
  }

  getIconClassNames() {
    const { classList } = this.props
    return classNames('FormIcon', classList)
  }

  getStatusIcon() {
    const { status } = this.props
    switch (status) {
      case STATUS.REQUEST:
        return <RequestIcon />
      case STATUS.FAILURE:
        return <FailureIcon />
      case STATUS.SUCCESS:
        return <SuccessIcon />
      case STATUS.INDETERMINATE:
      default:
        return null
    }
  }

  // TODO: this was a quick fix to get forms to not throw
  // a warning when passing props that aren't actual attributes
  getElementProps() {
    const elementProps = { ...this.props }
    const blacklistedProps = [
      'activeType',
      'icon',
      'classList',
      'renderFeedback',
      'renderStatus',
      'status',
      'suggestions',
      'tabs',
      'text',
      'trimWhitespace',
    ]
    blacklistedProps.forEach((prop) => {
      delete elementProps[prop]
    })
    return elementProps
  }

  checkValue = () => {
    const inputControl = this.input
    const { text } = this.state
    if (inputControl && inputControl.value !== text) {
      this.onChangeValue(inputControl.value)
    }
    this.timer = setTimeout(this.checkValue, 250)
  }

  clear() {
    this.input.value = ''
  }

  renderLabel() {
    const { id, label } = this.props
    const labelClassNames = this.getLabelClassNames()
    return (
      <label className={labelClassNames} htmlFor={id}>
        {label}
      </label>
    )
  }

  renderIcon() {
    const { icon } = this.props
    const iconClassNames = this.getIconClassNames()
    return (
      <span className={iconClassNames}>
        {icon}
      </span>
    )
  }

  renderTextArea(text, inputClassNames) {
    return (
      <textarea
        {...this.getElementProps()}
        className={inputClassNames}
        onFocus={this.onFocusControl}
        onBlur={this.onBlurControl}
        onChange={this.onChangeControl}
        ref={(comp) => { this.input = comp }}
        defaultValue={text}
      />
    )
  }

  renderInput(text, inputClassNames) {
    return (
      <input
        {...this.getElementProps()}
        className={inputClassNames}
        onFocus={this.onFocusControl}
        onBlur={this.onBlurControl}
        onChange={this.onChangeControl}
        ref={(comp) => { this.input = comp }}
        defaultValue={text}
      />
    )
  }

  render() {
    const { icon, kind, label, renderFeedback, renderStatus } = this.props
    const { text } = this.state
    const groupClassNames = this.getGroupClassNames()
    const inputClassNames = this.getInputClassNames()
    const statusClassNames = this.getStatusClassNames()
    return (
      <div className={groupClassNames}>
        {icon && this.renderIcon()}
        {label && this.renderLabel()}
        {
          kind === 'textarea' ?
            this.renderTextArea(text, inputClassNames) :
            this.renderInput(text, inputClassNames)
        }
        <span className={statusClassNames}>
          {this.getStatusIcon()}
        </span>
        {renderStatus ? renderStatus() : null}
        {renderFeedback ? renderFeedback() : null}
      </div>
    )
  }
}

export default FormControl

