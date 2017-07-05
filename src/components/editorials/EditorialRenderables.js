// @flow
import React from 'react'
import { Link } from 'react-router'
import { loadPostStream } from 'ello-brains/actions/editorials'
import InvitationFormContainer from '../../containers/InvitationFormContainer'
import StreamContainer from '../../containers/StreamContainer'
import BackgroundImage from '../assets/BackgroundImage'
import RegistrationRequestForm from '../forms/RegistrationRequestForm'
import {
  EditorialOverlay,
  EditorialTitle,
  EditorialSubtitle,
  EditorialTools,
  EditorialUsernameTitle,
} from './EditorialParts'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import type { EditorialProps } from '../../types/flowtypes'

const baseStyle = css(
  s.relative,
  s.flex,
  s.flexWrap,
  s.fullWidth,
  s.fullHeight,
  s.px20,
  s.py20,
  s.bgcTransparent,
  media(s.minBreak2, s.px40, s.py40),
)

const headerStyle = css(
  s.relative,
  s.zIndex2,
  s.fullWidth,
  s.transitionOpacity,
)

const bodyStyle = css(
  s.fullWidth,
  s.selfEnd,
)

const subtitleStyle = css(
  s.relative,
  s.zIndex2,
)

const toolsStyle = css(
  s.relative,
  s.zIndex4,
)

const linkStyle = css(
  s.absolute,
  s.flood,
  s.zIndex3,
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
      <div className={subtitleStyle}>
        <EditorialSubtitle label={props.editorial.get('subtitle')} />
      </div>
      <div className={toolsStyle}>
        <EditorialTools isPostLoved={props.isPostLoved} postPath={props.postPath} />
      </div>
    </div>
    <EditorialOverlay />
    <BackgroundImage
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
  </div>
)

// -------------------------------------

const postStreamBaseStyle = css(
  { ...baseStyle },
  { padding: '0 !important' },
  select('& .ElloMark.isSpinner > .SmileShape', { fill: '#fff !important' }),
)

export const PostStream = (props: EditorialProps) => (
  <div className={postStreamBaseStyle}>
    { props.postStreamHref &&
      <StreamContainer
        className="inEditorial"
        action={loadPostStream({
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

const postHeaderStyle = css(
  { ...headerStyle },
  media(s.minBreak2, { width: 'calc(100% - 35px)' }),
)

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
    <header className={postHeaderStyle}>
      <EditorialTitle label={`${props.title} `} />
      <EditorialUsernameTitle label={`@${props.username}`} />
    </header>
    <div className={bodyStyle}>
      <div className={toolsStyle}>
        <EditorialTools isPostLoved={props.isPostLoved} postPath={props.detailPath} />
      </div>
    </div>
    <EditorialOverlay />
    <BackgroundImage
      dpi={props.dpi}
      sources={props.sources || props.fallbackSources}
      useGif
    />
  </div>
)

// -------------------------------------

export const LinkEditorial = (props: EditorialProps) => (
  <div className={baseStyle}>
    {props.path && props.kind === 'internal' &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.path}
      >
        <span className={linkTextStyle}>{props.url}</span>
      </Link>
    }
    {props.url && props.kind === 'external' &&
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
      <div className={subtitleStyle}>
        <EditorialSubtitle label={props.editorial.get('subtitle')} />
      </div>
    </div>
    <EditorialOverlay />
    <BackgroundImage
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
  s.bgcRed,
  s.pointerNone,
)

const errorTextStyle = css(
  s.relative,
  s.zIndex2,
  s.colorWhite,
)

export const ErrorEditorial = () => (
  <div className={errorStyle}>
    <span className={errorTextStyle}>Something went wrong.</span>
    <EditorialOverlay />
  </div>
)

// -------------------------------------

const joinStyle = css(
  { ...baseStyle },
  s.colorWhite,
  select('& .AuthenticationForm', s.absolute, { bottom: 0, maxWidth: '100%', width: '100%' }),
  select('& .JoinForm', s.relative, s.fullWidth),
  select('& .JoinForm .FormButton', s.mt40),
  select('& .JoinForm .FormControlStatusMessage', s.mb0),
  select('& .JoinForm .AuthenticationTermsCopy', s.absolute, s.fontSize12, { bottom: 50 }),
  select('& h1', s.fontSize24, s.mt30, s.sansBlack),
  select('& h2', s.fontSize16),
)

export const JoinEditorial = (props: EditorialProps) => (
  <div className={joinStyle}>
    <BackgroundImage
      className="hasOverlay6"
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
    <RegistrationRequestForm inEditorial />
  </div>
)

// -------------------------------------

const inviteStyle = css(
  { ...baseStyle },
  s.colorWhite,
  select('& .InvitationsForm', s.mx0, s.relative, s.fullWidth, s.zIndex3),
  select('& .InvitationsForm form', s.absolute, s.fullWidth, { bottom: 0 }),
  select('& .InvitationsForm .FormButton', s.mt0),
  select('& .BatchEmailControl .FormControlInput.isBoxControl', { height: 85 }),
  select('& h1', s.fontSize24, s.sansBlack),
  select('& header p', s.fontSize16),
  select('& .BatchEmailControlSuggestions', s.colorWhite, s.mb30),
)

export const InviteEditorial = (props: EditorialProps) => (
  <div className={inviteStyle}>
    <BackgroundImage
      className="hasOverlay6"
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
    <header className={headerStyle}>
      <h1>Invite some cool people</h1>
      <p>Help Ello grow.</p>
    </header>
    <InvitationFormContainer inEditorial />
  </div>
)

