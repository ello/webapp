// @flow
import React from 'react'
import { Link } from 'react-router'
import { loadCuratedPosts } from '../../actions/editorials'
import StreamContainer from '../../containers/StreamContainer'
import BackgroundImage from '../assets/BackgroundImage'
import { EditorialTitle, EditorialSubtitle, EditorialTools } from './EditorialParts'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'
import type { EditorialProps } from '../../types/flowtypes'

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
  s.zIndex3,
  s.fullWidth,
  s.selfEnd,
)

const linkStyle = css(
  s.absolute,
  s.flood,
  s.zIndex2,
  { color: 'rgba(0, 0, 0, 0)' },
  s.bgcCurrentColor,
)

const linkTextStyle = css(s.hidden)

// -------------------------------------

export const PostEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    { props.postPath &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.postPath}
      >
        <span className={linkTextStyle}>{props.postPath}</span>
      </Link>
    }
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
      useGif
    />
  </div>
)

// -------------------------------------

const curatedBaseStyle = css(
  { ...baseStyle },
  s.px0,
  s.py0,
)

export const CuratedEditorial = (props: EditorialProps) => (
  <div className={curatedBaseStyle}>
    { props.postStreamHref &&
      <StreamContainer
        className="inEditorial"
        action={loadCuratedPosts({
          endpointPath: props.postStreamHref,
          editorialTrackOptions: props.trackOptions,
          fallbackSources: props.sources,
          onClickEditorial: props.onClickEditorial,
          resultKey: `${props.editorialId}_${props.size}_${props.position}`,
          title: props.editorial.get('title'),
        })}
        shouldInfiniteScroll={false}
      />
    }
  </div>
)

type PostProps = {
  dpi: string,
  detailPath: string,
  fallbackSources: string,
  isPostLoved: boolean,
  onClickEditorial: () => {},
  sources: any,
  title: string,
  username: string,
}

export const CuratedPost = (props: PostProps) => (
  <div className={baseStyle}>
    { props.detailPath &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.detailPath}
      >
        <span className={linkTextStyle}>{props.detailPath}</span>
      </Link>
    }
    <header className={headerStyle}>
      <EditorialTitle label={`${props.title} `} />
      <EditorialTitle label={`@${props.username}`} />
    </header>
    <div className={bodyStyle}>
      <EditorialTools isPostLoved={props.isPostLoved} postPath={props.detailPath} />
    </div>
    <BackgroundImage
      className="inEditorial hasOverlay5"
      dpi={props.dpi}
      sources={props.sources || props.fallbackSources}
      useGif
    />
  </div>
)

// -------------------------------------

export const ExternalEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    { props.url &&
      <a
        className={linkStyle}
        href={props.url}
        onClick={props.onClickEditorial}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className={linkTextStyle}>{props.url}</span>
      </a>
    }
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
      useGif
    />
  </div>
)

// -------------------------------------

const errorStyle = css(
  { ...baseStyle },
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fontSize14,
  s.colorWhite,
  s.bgcRed,
)

export const ErrorEditorial = () => (
  <div className={errorStyle}>
    <span>Something went wrong.</span>
  </div>
)

