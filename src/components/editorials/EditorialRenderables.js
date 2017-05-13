// @flow
import React from 'react'
import { EditorialTitle, EditorialSubtitle, EditorialTools } from './EditorialParts'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'
import type { EditorialProps } from '../../types/flowtypes'
import BackgroundImage from '../assets/BackgroundImage'

const baseStyle = css(
  s.relative,
  s.flex,
  s.flexWrap,
  s.fullWidth,
  s.fullHeight,
  s.px40,
  s.py40,
  s.bgcTransparent,
)

const headerStyle = css(
  s.relative,
  s.zIndex1,
  s.fullWidth,
)

const bodyStyle = css(
  s.relative,
  s.zIndex1,
  s.fullWidth,
  s.selfEnd,
)

export const PostEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialSubtitle label={props.editorial.get('subtitle')} />
      <EditorialTools isPostLoved={props.isPostLoved} postPath={props.postPath} />
    </div>
    <BackgroundImage
      className="inEditorial hasOverlay5"
      dpi={props.dpi}
      sources={props.sources}
      to={props.postPath}
      onClick={props.onClickEditorial}
    />
  </div>
)

export const CuratedPostEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialTools isPostLoved={props.isPostLoved} postPath={props.postPath} />
    </div>
    <BackgroundImage
      className="inEditorial hasOverlay5"
      dpi={props.dpi}
      sources={props.sources}
      to={props.postPath}
      onClick={props.onClickEditorial}
    />
  </div>
)

export const ExternalEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialSubtitle label={props.editorial.get('subtitle')} />
    </div>
    <BackgroundImage
      className="inEditorial hasOverlay5"
      dpi={props.dpi}
      sources={props.sources}
      to={props.url}
      onClick={props.onClickEditorial}
    />
  </div>
)

