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

// -------------------------------------

export const NavbarLabel = () =>
  <h2 className="NavbarLabel">Ello</h2>

// -----------------

export const NavbarLayoutTool = ({ icon, onClick }) =>
  <button className="NavbarLayoutTool" onClick={onClick} >
    {icon}
  </button>

NavbarLayoutTool.propTypes = {
  icon: PropTypes.node,
  onClick: PropTypes.func,
}

// -----------------

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
      <span className="NavbarLinkLabel">{label}</span>
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

// -----------------

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
      className="NavbarMark"
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

export const NavbarMorePostsButton = ({ onClick }) =>
  <button className="NavbarMorePostsButton" onClick={onClick} >
    <ArrowIcon />
    <span>New Posts</span>
  </button>

NavbarMorePostsButton.propTypes = {
  onClick: PropTypes.func,
}

// -------------------------------------

export const NavbarOmniButton = ({ onClick, onDragOver }) =>
  <button className="NavbarOmniButton" onClick={onClick} onDragOver={onDragOver}>
    <PencilIcon />
    <span>Post</span>
  </button>

NavbarOmniButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
}

// -------------------------------------

const threadlessLink = 'http://ello.threadless.com/'

export const NavbarProfile = ({
  avatar,
  isProfileMenuActive,
  onClickAvatar,
  onLogOut,
  username,
}) => {
  if (avatar && username) {
    return (
      <span className="NavbarProfile">
        <Avatar sources={avatar} onClick={onClickAvatar} />
        <nav className={classNames('NavbarProfileLinks', { isActive: isProfileMenuActive })} >
          <Link className="NavbarProfileLink truncate" to={`/${username}`}>{`@${username}`}</Link>
          <Link className="NavbarProfileLink truncate" to={`/${username}/loves`}>Loves</Link>
          <Link className="NavbarProfileLink truncate" to="/invitations">Invite</Link>
          <Link className="NavbarProfileLink truncate" to="/settings">Settings</Link>
          <hr className="NavbarProfileLinkDivider" />
          <a
            className="NavbarProfileLink truncate"
            href={`${ENV.AUTH_DOMAIN}/wtf`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Help
          </a>
          <a
            className="NavbarProfileLink truncate"
            href={threadlessLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            Store
          </a>
          <button className="NavbarProfileLink truncate" onClick={onLogOut}>Logout</button>
          <button className="NavbarProfileCloseButton">
            <XIconLG />
          </button>
        </nav>
      </span>
    )
  }
  return (
    <span className="NavbarProfile">
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

