import React, { PropTypes } from 'react'
import classNames from 'classnames'

// -------------------------------------

export const FooterLabel = ({ label }) =>
  <span className="FooterLabel">
    {label}
  </span>

FooterLabel.propTypes = {
  label: PropTypes.string.isRequired,
}

// -----------------

// This is alway an external link.
export const FooterLink = ({ className, href, icon, label }) =>
  <a
    className={classNames(className, 'FooterLink')}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {icon}
    <span>{label}</span>
  </a>

FooterLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
}
FooterLink.defaultProps = {
  className: null,
  icon: null,
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

