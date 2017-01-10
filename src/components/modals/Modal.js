/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const Modal = ({ classList, component, kind, isActive, onClickModal }) =>
  <div className={classNames(classList, kind, { isActive })} onClick={onClickModal}>
    {component}
  </div>

Modal.propTypes = {
  classList: PropTypes.string,
  component: PropTypes.node,
  isActive: PropTypes.bool.isRequired,
  kind: PropTypes.string.isRequired,
  onClickModal: PropTypes.func,
}
Modal.defaultProps = {
  classList: null,
  component: null,
  onClickModal: null,
}

export default Modal

