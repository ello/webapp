import React, { PropTypes } from 'react'

const TreePanel = ({ children }) =>
  <div className="TreePanel">
    {children}
  </div>

TreePanel.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TreePanel

