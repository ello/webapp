// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../assets/Icons'
import { after, css, media, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const buttonStyle = css(
  s.colorWhite,
  s.transitionColor,
  select('&.isActive .HeartIcon > g', { fill: 'currentColor' }),
  select('& .BubbleIcon > g:nth-child(2)', s.displayNone),
  hover(
    s.colorA,
    select('& .HeartIcon > g', { fill: 'currentColor' }),
    select('& .BubbleIcon > g', { fill: 'currentColor' }),
  ),
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
  onClickLovePost?: () => {},
  onClickOpenSignupModal?: () => {},
  onClickSharePost: () => {},
}

export const EditorialTools = (props: ToolProps, context: ToolContext) => (
  <div className={toolsStyle}>
    <ToolButton
      className={props.isPostLoved ? 'isActive' : null}
      onClick={context.onClickLovePost}
    >
      <HeartIcon />
    </ToolButton>
    <ToolButton
      className={leftSpacer}
      onClick={context.onClickOpenSignupModal}
      to={context.onClickOpenSignupModal ? null : props.postPath}
    >
      <BubbleIcon />
    </ToolButton>
    <ToolButton
      className={leftSpacer}
      onClick={context.onClickOpenSignupModal}
      to={context.onClickOpenSignupModal ? null : props.postPath}
    >
      <RepostIcon />
    </ToolButton>
    <ToolButton
      className={alignEnd}
      onClick={context.onClickSharePost}
    >
      <ShareIcon />
    </ToolButton>
  </div>
)
EditorialTools.contextTypes = {
  onClickLovePost: PropTypes.func,
  onClickOpenSignupModal: PropTypes.func,
  onClickSharePost: PropTypes.func.isRequired,
}

// -------------------------------------

const titleStyle = css(
  s.colorWhite,
  s.fontSize32,
  { lineHeight: 38 },
  media(s.minBreak2, s.fontSize48, { lineHeight: 54 }),
)

export const EditorialTitle = ({ label }: { label: string }) => (
  <h2 className={titleStyle}>{label}</h2>
)

// -------------------------------------

const subtitleStyle = css(
  s.colorWhite,
  s.fontSize18,
  { lineHeight: 24 },
  media(s.minBreak2, s.fontSize24, { lineHeight: 30 }),
)

export const EditorialSubtitle = ({ label }: { label: string }) => (
  <h3 className={subtitleStyle}>
    <span>{label}</span>
  </h3>
)

// -------------------------------------

const overlayStyle = css(
  s.absolute,
  s.flood,
  s.zIndex1,
  s.transitionBgColorSlow,
  { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  after(
    s.absolute,
    s.flood,
    s.zIndex1,
    { top: '50%', content: '""' },
    { background: 'linear-gradient(to top, rgba(0, 0, 0, 0.666) 0%, rgba(0, 0, 0, 0) 80%)' },
  ),
  select('.no-touch *:hover ~ &', { backgroundColor: 'rgba(0, 0, 0, 0.1)' }),
)


export const EditorialOverlay = () => (
  <div className={overlayStyle} />
)

