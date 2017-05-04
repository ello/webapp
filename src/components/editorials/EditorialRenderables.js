// @flow
import React from 'react'
import { BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../assets/Icons'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'
import type { EditorialProps } from '../../types/flowtypes'

const baseStyle = css(
  s.flex,
  s.flexWrap,
  s.fullWidth,
  s.fullHeight,
  s.px40,
  s.py40,
)

const titleStyle = css(
  s.fullWidth,
  s.fontSize48,
  s.colorWhite,
)

const subtitleStyle = css(
  s.selfEnd,
  s.fullWidth,
  s.fontSize24,
  s.colorWhite,
)

const toolsStyle = css(
  s.selfEnd,
  s.fullWidth,
  s.colorWhite,
)

export const PostEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: 'black' }}>
    <h2 className={titleStyle}>{props.editorial.get('title')}</h2>
    <h3 className={subtitleStyle}>
      <span>{props.editorial.get('subtitle')}</span>
      <span>{` PostEditorial "${props.editorial.get('id')}" with kind "${props.editorial.get('kind')}"`}</span>
      <span>{` links to post id "${props.editorial.getIn(['links', 'post', 'id'])}"`}</span>
      <span>{` and image "${props.editorial.get('image')}".`}</span>
    </h3>
    <div className={toolsStyle}>
      <HeartIcon />
      <BubbleIcon />
      <RepostIcon />
      <ShareIcon />
    </div>
  </div>
)

export const CuratedPostEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: '#666' }}>
    <h2 className={titleStyle}>{props.editorial.get('title')}</h2>
    <h3 className={subtitleStyle}>
      <span>{` CuratedPostEditorial "${props.editorial.get('id')}" with kind "${props.editorial.get('kind')}"`}</span>
      <span>{` and image "${props.editorial.get('image')}".`}</span>
    </h3>
    <div className={toolsStyle}>
      <HeartIcon />
      <BubbleIcon />
      <RepostIcon />
      <ShareIcon />
    </div>
  </div>
)

export const ExternalEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: '#999' }}>
    <h2 className={titleStyle}>{props.editorial.get('title')}</h2>
    <h3 className={subtitleStyle}>
      <span>{props.editorial.get('subtitle')}</span>
      <span>{` ExternalEditorial "${props.editorial.get('id')}" with kind "${props.editorial.get('kind')}"`}</span>
      <span>{` with url "${props.editorial.get('url')}"`}</span>
      <span>{` and image "${props.editorial.get('image')}".`}</span>
    </h3>
  </div>
)

