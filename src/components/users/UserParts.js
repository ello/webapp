/* eslint-disable react/no-danger */

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { numberToHuman } from '../../lib/number_to_human'
import { BadgeCheckIcon, MarkerIcon, ShareIcon } from '../assets/Icons'
import { MiniPillButton } from '../buttons/Buttons'
import Hint from '../hints/Hint'

// -------------------------------------

const UserStatsLink = ({ asDisabled = false, children, to }, { onClickScrollToContent }) =>
  (asDisabled ?
    <span className="UserStatsLink asDisabled">
      {children}
    </span> :
    <Link onClick={onClickScrollToContent} className="UserStatsLink" to={to}>
      {children}
    </Link>)

UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node,
  to: PropTypes.string,
}
UserStatsLink.contextTypes = {
  onClickScrollToContent: PropTypes.func,
}

// -----------------

export const UserFeaturedButton = ({ className, onClick }) =>
  <button className={classNames('UserFeaturedButton', className)} onClick={onClick} >
    <BadgeCheckIcon />
  </button>

UserFeaturedButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

// -----------------

export const UserNamesCell = ({ className, name, username, children }) =>
  <div className={classNames('UserCell UserNamesCell', className, { isSingle: !name })}>
    <h1 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h1>
    {name ? <h2 className="UserUsername truncate">@{username}</h2> : null}
    { children }
  </div>

UserNamesCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserNamesCellCard = ({ className, name, username }) =>
  <div className={classNames('UserCell UserNamesCell', className)}>
    <h2 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h2>
    {name ? <h3 className="UserUsername truncate">@{username}</h3> : null}
  </div>

UserNamesCellCard.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserFiguresCell = ({
  className,
  onClickOpenFeaturedModal,
  onClickShareProfile,
  totalPostViewsCount,
}) =>
  <div className={classNames('UserCell UserFiguresCell', className)}>
    { totalPostViewsCount ? <span className="UserFiguresCount uppercase">{totalPostViewsCount} </span> : null }
    { totalPostViewsCount ? <span className="UserFiguresLabel">Total Views</span> : null }
    { onClickOpenFeaturedModal || onClickShareProfile ?
      <div className="UserFiguresButtons">
        { onClickOpenFeaturedModal ?
          <UserFeaturedButton className={className} onClick={onClickOpenFeaturedModal} />
          : null
        }
        { onClickShareProfile ?
          <button className="UserFiguresShareButton" onClick={onClickShareProfile} >
            <ShareIcon />
          </button> : null
        }
      </div> : null
    }
  </div>

UserFiguresCell.propTypes = {
  className: PropTypes.string,
  onClickOpenFeaturedModal: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  totalPostViewsCount: PropTypes.string,
}

// -----------------

export const UserStatsCell = ({
  className, followingCount, followersCount, lovesCount, postsCount, username,
}) =>
  <div className={classNames('UserCell UserStatsCell', className)}>
    <dl>
      <UserStatsLink to={`/${username}`}>
        <dt>{numberToHuman(postsCount)}</dt>
        <dd><span className="UserStatsCountLabel">Posts</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!followingCount} to={`/${username}/following`}>
        <dt>{numberToHuman(followingCount)}</dt>
        <dd><span className="UserStatsCountLabel">Following</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink
        asDisabled={typeof followersCount === 'string' || !followersCount}
        to={`/${username}/followers`}
      >
        <dt>
          {
            typeof followersCount === 'string' ?
              followersCount :
              numberToHuman(followersCount)
          }
        </dt>
        <dd><span className="UserStatsCountLabel">Followers</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!lovesCount} to={`/${username}/loves`} >
        <dt>{numberToHuman(lovesCount)}</dt>
        <dd><span className="UserStatsCountLabel">Loves</span></dd>
      </UserStatsLink>
    </dl>
  </div>

UserStatsCell.propTypes = {
  className: PropTypes.string,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lovesCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserLocationCell = ({ className, location }) =>
  <div className={classNames('UserCell UserLocationCell', className)}>
    { location ?
      <p className="UserLocation">
        <MarkerIcon />
        {location}
      </p>
      : null
    }
  </div>

UserLocationCell.propTypes = {
  className: PropTypes.string,
  location: PropTypes.string,
}

// -----------------

export const UserInfoCell = ({ className, onClickOpenBio, truncatedShortBio }) =>
  <div className={classNames('UserCell UserInfoCell', className)}>
    { truncatedShortBio && truncatedShortBio.length ?
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: truncatedShortBio }} /> : null
    }
    { onClickOpenBio ?
      <button className="MoreBioButton" onClick={onClickOpenBio} >
        <span className="MoreBioButtonLabel">See More</span>
      </button> : null
    }
  </div>

UserInfoCell.propTypes = {
  className: PropTypes.string,
  onClickOpenBio: PropTypes.func,
  truncatedShortBio: PropTypes.string,
}

// -----------------

export const UserLinksCell = ({ className, externalLinksList, isMobile }) => {
  const externalLinks = []
  const externalLinksIcon = []
  if (externalLinksList && externalLinksList.size) {
    externalLinksList.forEach((link) => {
      if (link.get('icon')) {
        externalLinksIcon.push(
          <span className="UserExternalLinksIcon" key={link.get('type')}>
            <a href={link.get('url')} rel="noopener noreferrer" target="_blank">
              <img alt={link.get('type')} src={link.get('icon')} />
              <Hint>{link.get('type')}</Hint>
            </a>
          </span>,
        )
      } else {
        externalLinks.push(
          <span className="UserExternalLinksLabel" key={link.get('text')}>
            <a href={link.get('url')} rel="noopener noreferrer" target="_blank">{link.get('text')}</a>
          </span>,
        )
      }
    })
  }
  // Magic numbers explained:
  // 32 = the height of an icon (22) + the margin-top (10)
  // 34 = the top/bottom padding of the container (17)
  // 5 = top position of the right icon content
  const linkIconHeight = isMobile ?
    (Math.ceil(externalLinksIcon.length / 3) * 32) + 34 + 5 :
    (Math.ceil(externalLinksIcon.length / 4) * 32) + 34 + 5
  const style = externalLinksIcon.length > 0 && externalLinks.length ?
    { height: linkIconHeight } :
    { height: null }
  return (
    <div
      className={classNames('UserCell UserLinksCell', className)}
      data-num-icons={externalLinksIcon.length}
      data-num-links={externalLinks.length}
      style={style}
    >
      <div className="UserExternalLinksLeft">
        {externalLinks}
      </div>
      <div className="UserExternalLinksRight">
        {externalLinksIcon}
      </div>
    </div>
  )
}

UserLinksCell.propTypes = {
  className: PropTypes.string,
  externalLinksList: PropTypes.object,
  isMobile: PropTypes.bool,
}

export const UserProfileButtons = ({ children, className, onClickCollab, onClickHireMe }) =>
  <div className={classNames('UserProfileButtons', className)}>
    {onClickCollab ?
      <MiniPillButton className="size58" onClick={onClickCollab} >Collab</MiniPillButton> : null
    }
    {onClickHireMe ?
      <MiniPillButton className="size58" onClick={onClickHireMe} >Hire</MiniPillButton> : null
    }
    {children}
  </div>

UserProfileButtons.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
}

