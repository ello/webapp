// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component, PropTypes, PureComponent } from 'react'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { ArrowEastIcon } from '../assets/Icons'
import EmailControl from '../forms/EmailControl'
import FormButton from '../forms/FormButton'

// -----------------

type FormPropTypes = {
  formActionPath: string,
  formMessage: string,
  formStatus: string,
  isDisabled: boolean,
  isMobile: boolean,
}

export class FooterForm extends PureComponent {
  static contextTypes = {
    onChangeEmailControl: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  getStatusAsClassName() {
    const { formStatus } = this.props
    switch (formStatus) {
      case STATUS.FAILURE:
        return 'isFailing'
      case STATUS.SUCCESS:
        return 'isSucceeding'
      default:
        return 'isIndeterminate'
    }
  }

  props: FormPropTypes
  render() {
    const { formActionPath, formMessage, isDisabled, isMobile } = this.props
    const { onChangeEmailControl, onSubmit } = this.context
    return (
      <form
        action={formActionPath}
        className={classNames('FooterForm', this.getStatusAsClassName())}
        method="POST"
        noValidate="novalidate"
        onSubmit={onSubmit}
        role="form"
      >
        <EmailControl
          classList="inFooter"
          label="Email"
          onChange={onChangeEmailControl}
          placeholder={isMobile ? 'Subscribe' : 'Enter email for daily inspiration'}
        />
        <FormButton
          className="FormButton inFooter"
          disabled={isDisabled}
        >
          { isMobile ? <ArrowEastIcon /> : 'Subscribe' }
        </FormButton>
        { formMessage && formMessage.length &&
          <span className="FormControlStatusBubble inFooter">{formMessage}</span>
        }
      </form>
    )
  }
}

// -----------------

type LinkPropTypes = {
  className?: string,
  href: string,
  label: string,
}

export class FooterLink extends PureComponent {
  static defaultProps = {
    className: '',
  }

  props: LinkPropTypes
  render() {
    const { className, href, label } = this.props
    return (
      <a
        className={classNames(className, 'FooterLink')}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{label}</span>
      </a>
    )
  }
}

// -----------------

type ToolPropTypes = {
  className?: string,
  icon: React.Element<*>,
  label: string,
  onClick: () => void,
}

export class FooterTool extends Component {
  static defaultProps = {
    className: '',
  }

  shouldComponentUpdate(nextProps: ToolPropTypes) {
    return nextProps.label !== this.props.label || nextProps.className !== this.props.className
  }

  props: ToolPropTypes
  render() {
    const { className, icon, label, onClick } = this.props
    return (
      <button className={classNames(className, 'FooterTool')} onClick={onClick} >
        {icon}
        <span>{label}</span>
      </button>
    )
  }
}

