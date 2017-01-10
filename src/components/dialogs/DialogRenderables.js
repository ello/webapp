/* eslint-disable react/no-danger */

import React, { PropTypes } from 'react'
import { XIcon } from '../assets/Icons'

export const TextMarkupDialog = ({ html }) =>
  <div className="Dialog TextDialog TextMarkupDialog">
    <div className="TextDialogText" dangerouslySetInnerHTML={{ __html: html }} />
    <button className="CloseModal Dismiss"><XIcon /></button>
  </div>


TextMarkupDialog.propTypes = {
  html: PropTypes.string,
}

export const FeaturedInDialog = ({ children }) =>
  <div className="Dialog FeaturedInDialog">
    {children}
  </div>

FeaturedInDialog.propTypes = {
  children: PropTypes.node,
}

