import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import {
  ArrowIcon,
  ElloMark,
  ElloRainbowMark,
  ElloDonutMark,
  ElloNinjaSuit,
  PencilIcon,
  XIconLG,
} from '../assets/Icons'
import {
  active,
  after,
  before,
  css,
  hover,
  media,
  modifier,
  parent,
  select,
} from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const labelStyle = css(
  s.displayNone,
  s.relative,
  s.ml20,
  s.fontSize14,
  { top: 2, lineHeight: 1 },
  media(s.minBreak2, s.inlineBlock),
)
export const NavbarLabel = () => (
  <h2 className={labelStyle}>Ello</h2>
)

// -------------------------------------

const layoutToolStyle = css(
  s.absolute,
  { top: 12, left: 155 },
  s.colorA,
)
export const NavbarLayoutTool = ({ icon, onClick }) => (
  <button className={layoutToolStyle} onClick={onClick} >
    {icon}
  </button>
)

NavbarLayoutTool.propTypes = {
  icon: PropTypes.node,
  onClick: PropTypes.func,
}

// -------------------------------------
const linkLabelStyle = css(
  s.relative,
  s.inlineBlock,
  s.alignMiddle,
  parent('.NavbarLink.isActive >', s.colorBlack),
  parent('.NavbarLink:active >', s.colorBlack),
  parent('.no-touch .NavbarLink:hover >', s.colorBlack),
  parent('.NavbarLink.isSignUp.isActive >', s.colorWhite),
  parent('.NavbarLink.isSignUp:active >', s.colorWhite),
  parent('.no-touch .NavbarLink.isSignUp:hover >', s.colorWhite),
  select('.NavbarLink.isActive > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink:active > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink:hover > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink.isNotificationsUnread > &::before',
    s.absolute,
    { top: 5, left: -5, width: 5, height: 5, content: '""', borderRadius: '50%' },
    s.bgcRed,
  ),
  select('.no-touch .NavbarLink.isNotificationsUnread:hover > > &::before',
    { left: -7, width: 7, height: 7 },
  ),
  after(
    s.absolute,
    { bottom: 8, left: 0, width: 0, height: 2, content: '""' },
    s.bgcTransparent,
    { transition: `width 0.2s ${s.ease}, background-color 0.2s ease` },
  ),
  parent('.NavbarLink.isSignUp', after(s.displayNone)),
  parent('.no-touch .NavbarLink.IconOnly:hover >', after({ transitionDelay: '0.6s' })),
)

 // TODO: Move over styles from Icons
const linkStyle = css(
  s.relative,
  s.hv40,
  s.lh40,
  s.overflowHidden,
  s.fontSize14,
  s.colorA,
  s.nowrap,
  s.alignMiddle,
  { transition: `width 0.2s ${s.ease}, color 0.2s ease, background-color 0.2s ease` },
  before(s.hitarea),
  modifier('.isSignUp',
    { width: 80, borderRadius: 5 },
    s.colorWhite,
    s.center,
    s.bgcGreen,
    active({ backgroundColor: '#00b100' }),
    hover({ backgroundColor: '#00b100' }),
    modifier('.isActive', { backgroundColor: '#00b100' }),
  ),
  select('[data-dragging-priority="noise"] &[href="/following"]', s.px10, s.bgcYellow),
  select('[data-dragging-priority="inactive"] &[href="/following"]', s.px10, s.bgcYellow),
  select('[data-dragging-priority="noise"] &.hasDragOver[href="/following"]', { backgroundColor: '#cfc' }),
  select('[data-dragging-priority="inactive"] &.hasDragOver[href="/following"]', { backgroundColor: '#cfc' }),
  select('.NavbarLinks > & + &', s.ml30),
  // Crunch spacing on logged out for smaller devices: 360 / 16 = 22.5em
  media('(max-width: 22.5em)',
    select('.isLoggedOut .NavbarLinks > & + &', { marginLeft: 18 }),
  ),
  media(s.maxBreak2,
    parent('.isLoggedIn', s.mt40),
    select('.isLoggedIn &[href^="/notifications"]', s.absolute, s.m0, { top: 0, left: 55 }),
    select('.isLoggedIn &[href^="/search"]', s.absolute, s.m0, { top: 0, left: 100 }),
  ),
)

const highlightingRules = {
  '/': /^\/$|^\/discover\/trending$|^\/discover\/recent$/,
  '/following': /^\/following/,
}

export const NavbarLink = ({
    className = '',
    icon,
    label,
    onClick,
    onDragLeave,
    onDragOver,
    onDrop,
    pathname,
    to,
  }) => {
  const klassNames = classNames(
    'NavbarLink',
    className,
    `${linkStyle}`,
    {
      isActive: highlightingRules[to] ? pathname.match(highlightingRules[to]) : pathname.match(to),
    },
  )
  return (
    <Link
      className={klassNames}
      onClick={onClick}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      to={to}
    >
      {icon || null}
      <span className={linkLabelStyle}>{label}</span>
    </Link>
  )
}

NavbarLink.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

// -------------------------------------
const markStyle = css(
  s.relative,
  { transform: 'scale(0.75)', transformOrigin: 'top left' },
  parent('.isLoggedIn', s.displayNone),
  parent('.isLoggedOut', s.inlineBlock),
  media(s.minBreak2,
    s.transformNone,
    { transformOrigin: 'center center' },
    parent('.isLoggedIn', s.inlineBlock),
  ),
)

const getLogoMark = (mark) => {
  switch (mark) {
    case 'rainbow':
      return <ElloRainbowMark />
    case 'donut':
      return <ElloDonutMark />
    case 'none':
      return null
    case 'normal':
    default:
      return <ElloMark />
  }
}

const getLogoModifier = (mods) => {
  switch (mods) {
    case 'isNinja':
      return <ElloNinjaSuit />
    default:
      return null
  }
}

export const NavbarMark = ({ onClick }) => {
  const list = ENV.LOGO_MARK ? ENV.LOGO_MARK.split('.') : ['normal']
  const mark = list[0]
  const mods = list.length > 1 ? list.slice(1).join(' ') : ''
  return (
    <Link
      className={`NavbarMark ${markStyle}`}
      draggable
      onClick={onClick}
      to="/"
    >
      {getLogoModifier(mods)}
      {getLogoMark(mark)}
    </Link>
  )
}

NavbarMark.propTypes = {
  onClick: PropTypes.func.isRequired,
}

// -------------------------------------

const moreButtonStyle = css(
  s.absolute,
  { top: 10, borderRadius: '50%' },
  s.zIndex3,
  s.wv30,
  s.hv30,
  s.lh30,
  s.fontSize14,
  s.colorWhite,
  s.nowrap,
  s.bgcA,
  s.borderA,
  { transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.4s ease' },
  parent('.isLoggedIn', { right: 100 }),
  parent('.isLoggedOut', { right: 50 }),
  hover(s.color6, s.alignMiddle, { paddingLeft: 8 }),
  media(s.minBreak2,
    { top: 20 }, s.wv40, s.hv40, s.lh40,
    parent('.isLoggedIn', { right: 'auto', left: 200 }),
    parent('.isLoggedOut', { left: 120 }),
  ),
  media(s.minBreak3,
    { width: 'auto', paddingRight: 20, paddingLeft: 15, borderRadius: 20 },
  ),
  media(s.minBreak4,
    parent('.isLoggedIn', { left: 220 }),
    parent('.isLoggedOut', { left: 140 }),
  ),
)

const moreSpanStyle = css(
  s.displayNone,
  s.alignMiddle,
  { paddingLeft: 8 },
  media(s.minBreak3, s.inlineBlock),
)

export const NavbarMorePostsButton = ({ onClick }) =>
  <button className={`NavbarMorePostsButton ${moreButtonStyle}`} onClick={onClick} >
    <ArrowIcon />
    <span className={moreSpanStyle}>New Posts</span>
  </button>

NavbarMorePostsButton.propTypes = {
  onClick: PropTypes.func,
}

// -------------------------------------

const omniButtonStyle = css(
  s.absolute,
  { top: 10, right: 10, borderRadius: 15 },
  s.hv30,
  s.lh30,
  { paddingRight: 15, paddingLeft: 10 },
  s.fontSize14,
  s.colorWhite,
  s.bgcBlack,
  { transition: 'background-color 0.2s ease' },
  hover(s.bgc6),
  media(s.minBreak2,
    { top: 20, right: 'auto', left: 80, width: 100, borderRadius: 20 },
    s.hv40,
    s.lh40,
  ),
  media(s.minBreak4, { left: 100 }),
)

export const NavbarOmniButton = ({ onClick, onDragOver }) =>
  <button className={`NavbarOmniButton ${omniButtonStyle}`} onClick={onClick} onDragOver={onDragOver}>
    <PencilIcon />
    <span>Post</span>
  </button>

NavbarOmniButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
}

// -------------------------------------

const threadlessLink = 'http://ello.threadless.com/'

const profilePopStyle = css(
  s.absolute,
  { top: 10, left: 10, zIndex: 4 },
  s.transitionTransform,
  // wtf...?
  media(s.maxBreak2,
    select('.isProfileMenuActive ~ .Navbar .NavbarMain > *:not(.NavbarProfile)', s.displayNone),
  ),
  media(s.minBreak2,
    { top: 20, right: 20, left: 'auto' },
    hover(before(
      s.absolute,
      { top: 15, left: 0, width: 100, height: 30, content: '""' },
      { backgroundColor: 'rgba(0, 0, 0, 0)', transform: 'translateX(-100%)' },
    )),
  ),
  media(s.minBreak4, { right: 40 }),
)

const profileLinksStyle = css(
  s.absolute,
  s.zIndex2,
  { minWidth: 140 },
  s.py5,
  s.px10,
  s.overflowHidden,
  s.colorA,
  s.pointerNone,
  s.bgcWhite,
  s.borderA,
  { borderTop: 0 },
  s.opacity0,
  s.transitionOpacity,
  modifier('.isActive', s.pointerAuto, s.opacity1),
  media(s.maxBreak2, {
    top: -10,
    left: -10,
    width: '100vw',
    height: '100vh',
    padding: 0,
  }),
  media(s.minBreak2,
    {
      top: 40,
      right: 0,
      left: 'auto',
      maxWidth: 180,
    },
    parent('.no-touch .NavbarProfile:hover', s.pointerAuto, s.opacity1),
  ),
)

const profileLinkStyle = css(
  s.block,
  s.hv30,
  s.lh30,
  s.fontSize14,
  s.truncate,
  hover(s.colorBlack),
  media(s.maxBreak2,
    { height: 50, lineHeight: 50, textIndent: 10 },
    s.colorBlack,
    s.borderBottom,
  ),
)

const profileLinkSmallStyle = css(
  s.block,
  { height: 25, lineHeight: 25 },
  s.fontSize12,
  s.truncate,
  s.colorC,
  hover(s.colorBlack),
  media(s.maxBreak2,
    { textIndent: 10 },
    s.hv30,
    s.lh30,
    s.colorBlack,
  ),
)

const dividerStyle = css(
  { margin: '4px -10px', borderColor: '#ccc' },
  media(s.maxBreak2, { borderColor: 'transparent' }),
)

const closeButtonStyle = css(
  s.displayNone,
  s.absolute,
  { top: 5, right: 5 },
  media(s.maxBreak2, s.block),
)

export const NavbarProfile = ({
  avatar,
  isProfileMenuActive,
  onClickAvatar,
  onLogOut,
  username,
}) => {
  if (avatar && username) {
    return (
      <span className={`NavbarProfile ${profilePopStyle}`}>
        <Avatar sources={avatar} onClick={onClickAvatar} />
        <nav className={classNames(`${profileLinksStyle}`, { isActive: isProfileMenuActive })} >
          <Link className={profileLinkStyle} to={`/${username}`}>{`@${username}`}</Link>
          <Link className={profileLinkStyle} to={`/${username}/loves`}>Loves</Link>
          <Link className={profileLinkStyle} to="/invitations">Invite</Link>
          <Link className={profileLinkStyle} to="/settings">Settings</Link>
          <hr className={dividerStyle} />
          <a
            className={profileLinkSmallStyle}
            href={`${ENV.AUTH_DOMAIN}/wtf`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Help
          </a>
          <a
            className={profileLinkSmallStyle}
            href={threadlessLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            Store
          </a>
          <button className={profileLinkSmallStyle} onClick={onLogOut}>Logout</button>
          <button className={closeButtonStyle}>
            <XIconLG />
          </button>
        </nav>
      </span>
    )
  }
  return (
    <span className={`NavbarProfile ${profilePopStyle}`}>
      <Avatar />
    </span>
  )
}

NavbarProfile.propTypes = {
  avatar: PropTypes.object,
  isProfileMenuActive: PropTypes.bool,
  onClickAvatar: PropTypes.func,
  onLogOut: PropTypes.func,
  username: PropTypes.string,
}

