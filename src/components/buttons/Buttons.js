import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const MiniPillButton = ({ children, className, onClick }) =>
  <button
    className={classNames('MiniPillButton', className)}
    onClick={onClick}
  >
    {children}
  </button>

MiniPillButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default MiniPillButton

