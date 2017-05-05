// @flow
import React from 'react'
import { EditorialTitle, EditorialSubtitle, EditorialTools } from './EditorialParts'
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

const headerStyle = css(
  s.fullWidth,
)

const bodyStyle = css(
  s.fullWidth,
  s.selfEnd,
)

export const PostEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: 'black' }}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialSubtitle label={props.editorial.get('subtitle')} />
      <EditorialTools
        isPostLoved={props.isPostLoved}
        postPath={props.postPath}
      />
    </div>
  </div>
)

export const CuratedPostEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: '#666' }}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialTools isPostLoved={props.isPostLoved} postPath={props.postPath} />
    </div>
  </div>
)

export const ExternalEditorial = (props: EditorialProps) => (
  <div className={baseStyle} style={{ backgroundColor: '#999' }}>
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <EditorialSubtitle label={props.editorial.get('subtitle')} />
    </div>
  </div>
)

