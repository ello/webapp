import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const SVGComponent = ({ children, ...rest }) =>
  <svg {...rest}>
    {children}
  </svg>
SVGComponent.propTypes = {
  children: PropTypes.node.isRequired,
}

export const SVGIcon = ({ children, className, onClick }) =>
  <SVGComponent
    className={classNames(className, 'SVGIcon')}
    onClick={onClick}
    width="20"
    height="20"
  >
    {children}
  </SVGComponent>
SVGIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}
SVGIcon.defaultProps = {
  onClick: null,
}

export const SVGBox = ({ children, className, size }) =>
  <SVGComponent
    className={classNames(className, 'SVGBox')}
    width={size}
    height={size}
  >
    {children}
  </SVGComponent>
SVGBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  size: PropTypes.string,
}
SVGBox.defaultProps = {
  size: '40',
}

