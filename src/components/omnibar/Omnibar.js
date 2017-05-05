import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import Editor from '../editor/Editor'
import { ChevronIcon } from '../assets/Icons'
import { css, hover, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const omnibarStyle = css(
  s.relative,
  s.displayNone,
  s.pt30,
  s.bgcWhite,
  modifier('.isActive', s.block),
  media(s.minBreak2, s.pt0),
)

const revealButton = css(
  s.absolute,
  { top: 15, right: 5, width: 20 },
  s.overflowHidden,
  s.fontSize14,
  s.nowrap,
  s.transitionWidth,
  hover({ width: 100 }),
  media(s.minBreak2, { top: 25, right: 10 }),
)

export const Omnibar = ({ avatar, classList, isActive, isFullScreen, onClickCloseOmnibar }) => {
  if (!isActive) {
    return <div className={classNames(`Omnibar ${omnibarStyle}`, { isActive }, classList)} />
  }
  return (
    <div className={classNames(`Omnibar ${omnibarStyle}`, { isActive, isFullScreen }, classList)} >
      <Avatar sources={avatar} />
      <Editor shouldPersist />
      <button className={revealButton} onClick={onClickCloseOmnibar}>
        <ChevronIcon />
        Navigation
      </button>
    </div>
  )
}

Omnibar.propTypes = {
  avatar: PropTypes.object,
  classList: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool,
  onClickCloseOmnibar: PropTypes.func.isRequired,
}

Omnibar.defaultProps = {
  avatar: null,
  classList: null,
  isFullScreen: false,
}

export default Omnibar

