// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../assets/Icons'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const buttonStyle = css(
  s.colorWhite,
  select('&.isActive .HeartIcon > g', { fill: 'currentColor' }),
  select('& .BubbleIcon > g:nth-child(2)', s.displayNone),
)

type ToolButtonProps = {
  children?: React.Element<*> | null,
  className?: string | null,
  onClick?: () => {} | null,
  to?: string | null,
}

const ToolButton = (props: ToolButtonProps) => (
  props.to ?
    <Link className={`${buttonStyle} ${props.className || ''}`} to={props.to}>
      {props.children}
    </Link>
    :
    <button className={`${buttonStyle} ${props.className || ''}`} onClick={props.onClick}>
      {props.children}
    </button>
)

ToolButton.defaultProps = {
  children: null,
  className: null,
  onClick: null,
  to: null,
}

// -------------------------------------

const toolsStyle = css(
  s.flex,
  s.pt10,
)

const alignEnd = css(s.mlAuto)
const leftSpacer = css(s.ml20)

type ToolProps = {
  postPath: string,
  isPostLoved: boolean,
}

type ToolContext = {
  onClickSharePost: () => {},
}

export const EditorialTools = (props: ToolProps, context: ToolContext) => (
  <div className={toolsStyle}>
    <ToolButton className={props.isPostLoved ? 'isActive' : null}>
      <HeartIcon />
    </ToolButton>
    <ToolButton className={leftSpacer} to={props.postPath}>
      <BubbleIcon />
    </ToolButton>
    <ToolButton className={leftSpacer} to={props.postPath}>
      <RepostIcon />
    </ToolButton>
    <ToolButton className={alignEnd} onClick={context.onClickSharePost}>
      <ShareIcon />
    </ToolButton>
  </div>
)
EditorialTools.contextTypes = {
  onClickSharePost: PropTypes.func.isRequired,
}

// -------------------------------------

const titleStyle = css(
  s.fontSize48,
  s.colorWhite,
)

export const EditorialTitle = ({ label }: { label: string }) => (
  <h2 className={titleStyle}>{label}</h2>
)

const subtitleStyle = css(
  s.fontSize24,
  s.colorWhite,
)

export const EditorialSubtitle = ({ label }: { label: string }) => (
  <h3 className={subtitleStyle}>
    <span>{label}</span>
  </h3>
)
    // <span>asdfa asdf asdf asdf asd fas df asdf asdfasdfas dfas dfa sdfasdf:w</span>

