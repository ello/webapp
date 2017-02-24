import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { ArrowEastIcon } from '../assets/Icons'
import EmailControl from '../forms/EmailControl'
import FormButton from '../forms/FormButton'

// -----------------

export const FooterForm = (props, context) =>
  <form
    action={props.formActionPath}
    className="FooterForm"
    method="POST"
    noValidate="novalidate"
    onSubmit={context.onSubmit}
    role="form"
  >
    <EmailControl
      classList="inFooter"
      label="Email"
      onChange={context.onChangeEmailControl}
      placeholder={props.isMobile ? 'Subscribe' : 'Enter email for daily inspiration'}
    />
    <FormButton
      className="FormButton inFooter"
      disabled={props.isDisabled}
    >
      { props.isMobile ? <ArrowEastIcon /> : 'Subscribe' }
    </FormButton>
  </form>

FooterForm.propTypes = {
  formActionPath: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
}

// -----------------

export const FooterLink = ({ className, href, label }) =>
  <a
    className={classNames(className, 'FooterLink')}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    <span>{label}</span>
  </a>

FooterLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
FooterLink.defaultProps = {
  className: null,
}

// -----------------

export const FooterTool = ({ className, icon, label, onClick }) =>
  <button className={classNames(className, 'FooterTool')} onClick={onClick} >
    {icon}
    <span>{label}</span>
  </button>

FooterTool.propTypes = {
  className: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

