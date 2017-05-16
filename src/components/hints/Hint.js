import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

const showHintStyle = css(
  s.visible,
  s.opacity1,
  {
    transitionDelay: '0.5s, 0s',
    transitionDuration: '0.4s, 0s',
  },
)

const hintStyle = css(
  s.displayNone,
  s.hidden,
  s.absolute,
  {
    top: -25,
    left: 0,
    height: 22,
    padding: '0 11px',
    lineHeight: '22px',
    borderRadius: 11,
  },
  s.colorWhite,
  s.nowrap,
  s.pointerNone,
  s.bgcBlack,
  s.opacity0,
  s.borderBlack,
  {
    transition: 'opacity 0.2s ease, visibility 0s ease 0.2s, color 0.2s ease',
  },
  parent('.no-touch', s.inlineBlock),
  parent('.no-touch a:hover >', showHintStyle),
  parent('.no-touch button:hover >', showHintStyle),
  parent('.BlockMuteButton', { top: 5, left: 30 }, s.fontSize14),
  media(s.minBreak2, parent('.BlockMuteButton', { top: 5, left: 30 }, s.fontSize14)),
)

const Hint = ({ className, children }) =>
  <span className={classNames('Hint', `${hintStyle}`, className)}>{children}</span>

Hint.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
}
Hint.defaultProps = {
  className: null,
}

export default Hint

