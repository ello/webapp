import React, { PropTypes } from 'react'

const ConfirmDialog = ({ title, onConfirm, onDismiss }) =>
  <div className="Dialog ConfirmDialog">
    {title ? <h2>{title}</h2> : null}
    <button className="ConfirmDialogButton" onClick={onConfirm}>Yes</button>
    <button className="ConfirmDialogButton" onClick={onDismiss}>No</button>
  </div>

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ConfirmDialog

