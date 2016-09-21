import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { numberToHuman } from '../../vendor/number_to_human'
import { SVGIcon } from '../svg/SVGComponents'
import { MiniPillButton } from '../buttons/Buttons'

// -------------------------------------
// UserProfile Cells and parts

const ShareIcon = () =>
  <SVGIcon className="ShareIcon">
    <g>
      <polyline points="7.8,7.3 5,7.3 5,17.3 15,17.3 15,7.3 12.2,7.3" />
    </g>
    <g>
      <line x1="10" y1="2" x2="10" y2="12" />
      <polyline points="7.2,4.7 10,2 12.8,4.8" />
    </g>
  </SVGIcon>

// -----------------

const UserStatsLink = ({ asDisabled = false, children, to }) =>
  (asDisabled ?
    <span className="UserStatsLink asDisabled">
      {children}
    </span> :
    <Link activeClassName="isActive" className="UserStatsLink" to={to}>
      {children}
    </Link>)

UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node,
  to: PropTypes.string,
}

// -----------------

export const UserNamesCell = ({ className, name, username, children }) =>
  <div className={classNames('UserCell UserNamesCell', className)}>
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

export const UserDirtCell = ({ className, onClickShareProfile, totalViewsCount }) =>
  <div className={classNames('UserCell UserDirtCell', className)}>
    { totalViewsCount ? <span className="UserDirtCount uppercase">{totalViewsCount} </span> : null }
    { totalViewsCount ? <span className="UserDirtLabel">Total Views</span> : null }
    { onClickShareProfile ?
      <button className="UserDirtShareButton" onClick={onClickShareProfile} >
        <ShareIcon />
      </button> : null
    }
  </div>

UserDirtCell.propTypes = {
  className: PropTypes.string,
  onClickShareProfile: PropTypes.func,
  totalViewsCount: PropTypes.string,
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

export const UserInfoCell = ({ className, shortBio, location }) =>
  <div className={classNames('UserCell UserInfoCell', className)}>
    { shortBio ?
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: shortBio }} /> : null
    }
    { location ? <p className="UserLocation">{location}</p> : null }
  </div>

UserInfoCell.propTypes = {
  className: PropTypes.string,
  shortBio: PropTypes.string,
  location: PropTypes.string,
}

// -----------------

export const UserLinksCell = ({ className, externalLinksList }) => {
  let externalLinks = []
  if (externalLinksList) {
    externalLinks = externalLinksList.map((link, i) =>
      <span className="UserExternalLinksLabel" key={i}>
        <a href={link.url} rel="noopener noreferrer" target="_blank">{link.text}</a>
      </span>
    )
  }
  return (
    <div className={classNames('UserCell UserLinksCell', className)}>
      <div className="UserExternalLinks">
        {externalLinks}
      </div>
    </div>
  )
}

UserLinksCell.propTypes = {
  className: PropTypes.string,
  externalLinksList: PropTypes.array,
}

export const UserProfileButtons = ({ children, className, onClickHireMe }) =>
  <div className={classNames('UserProfileButtons', className)}>
    {onClickHireMe ?
      <MiniPillButton onClick={onClickHireMe} >Collab</MiniPillButton> : null
    }
    {onClickHireMe ?
      <MiniPillButton onClick={onClickHireMe} >Hire</MiniPillButton> : null
    }
    {children}
  </div>

UserProfileButtons.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClickHireMe: PropTypes.func,
}

