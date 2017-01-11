import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Hint from '../hints/Hint'
import { DotsIcon } from '../relationships/RelationshipIcons'

const BlockMuteButton = ({ className, onClick }) =>
  <button
    className={classNames('BlockMuteButton', className)}
    onClick={onClick}
  >
    <DotsIcon />
    <Hint>Block, Mute or Flag</Hint>
  </button>

BlockMuteButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default BlockMuteButton

