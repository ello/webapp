import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { numberToHuman } from '../../vendor/number_to_human'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import Hint from '../hints/Hint'
import { loadUserDrawer } from '../../actions/user'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MiniPillButton } from '../buttons/Buttons'
import { ShareIcon } from './UserIcons'

// -------------------------------------
// UserProfile Cells and parts

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

const UserNamesCell = ({ className, name, username, children }) =>
  <div className={classNames('UserCell UserNamesCell', className)}>
    <h1 className="UserName truncate">
      <Link to={`/${username}`} >{name || `@${username}`}</Link>
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

const UserNamesCellCard = ({ className, name, username }) =>
  <div className={classNames('UserCell UserNamesCell', className)}>
    <h2 className="UserName truncate">
      <Link to={`/${username}`} >{name || `@${username}`}</Link>
    </h2>
    {name ? <h3 className="UserUsername truncate">@{username}</h3> : null}
  </div>

UserNamesCellCard.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

// -----------------

const UserDirtCell = ({ className, onClickShareProfile, totalViewsCount }) =>
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

const UserStatsCell = ({
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

const UserInfoCell = ({ className, shortBio, location }) =>
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

const UserLinksCell = ({ className, externalLinksList }) => {
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

const UserProfileButtons = ({ children, className, onClickHireMe }) =>
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

// -------------------------------------
// Public renderables

export const UserAvatar = ({ user }) =>
  <Link className="UserAvatar" to={`/${user.username}`}>
    <Avatar
      priority={user.relationshipPriority}
      sources={user.avatar}
      userId={`${user.id}`}
      username={user.username}
    />
    <Hint>{`@${user.username}`}</Hint>
  </Link>

UserAvatar.propTypes = {
  user: PropTypes.object,
}

// -----------------

export const UserCompact = ({ user }) =>
  <div className="UserCompact">
    <div className="UserCompactHeader">
      <Link className="UserCompactUserLink truncate" to={`/${user.username}`}>
        <Avatar
          priority={user.relationshipPriority}
          sources={user.avatar}
          userId={`${user.id}`}
          username={user.username}
        />
        <span className="UserCompactUsername">{`@${user.username}`}</span>
      </Link>
    </div>
    <RelationshipContainer
      relationshipPriority={user.relationshipPriority}
      user={user}
    />
  </div>

UserCompact.propTypes = {
  user: PropTypes.object,
}

// -----------------

export const UserDrawer = ({ endpoint, icon, post, resultType }) =>
  <section className="UserDrawer">
    {icon}
    <StreamContainer
      action={loadUserDrawer(endpoint, post, resultType)}
      paginatorText="+more"
      ignoresScrollPosition
    />
  </section>

UserDrawer.propTypes = {
  endpoint: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  post: PropTypes.object.isRequired,
  resultType: PropTypes.string.isRequired,
}

// -----------------

export const UserProfileCard = ({ isMobile, onClickHireMe, user }) =>
  <div className="UserProfileCard" >
    <Avatar
      className="inUserProfileCard"
      priority={user.relationshipPriority}
      size={isMobile ? 'regular' : 'large'}
      sources={user.avatar}
      to={`/${user.username}`}
      userId={`${user.id}`}
      username={user.username}
    />
    <UserProfileButtons
      className="inUserProfileCard"
      onClickHireMe={user.isHireable ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfileCard"
        relationshipPriority={user.relationshipPriority}
        user={user}
      />
    </UserProfileButtons>
    <UserNamesCellCard
      className="inUserProfileCard"
      name={user.name}
      username={user.username}
    />
    <UserStatsCell
      className="inUserProfileCard"
      followingCount={user.followingCount}
      followersCount={user.followersCount}
      lovesCount={user.lovesCount}
      postsCount={user.postsCount}
      username={user.username}
    />
    { !isMobile ?
      <UserInfoCell
        className="inUserProfileCard"
        shortBio={user.formattedShortBio}
      /> : null
    }
    <BackgroundImage
      className="hasOverlay inUserProfileCard"
      coverImage={user.coverImage}
      to={`/${user.username}`}
    />
  </div>

UserProfileCard.propTypes = {
  isMobile: PropTypes.bool,
  onClickHireMe: PropTypes.func,
  user: PropTypes.object,
}

// -----------------

export const UserProfile = ({ user, onClickHireMe, onClickShareProfile }) =>
  <div className="UserProfile">
    <Avatar
      alt={user.name ? user.name : user.username}
      className="inUserProfile"
      priority={user.relationshipPriority}
      size="large"
      sources={user.avatar}
      to={`/${user.username}`}
      useGif={(user.viewsAdultContent || !user.postsAdultContent)}
      userId={`${user.id}`}
      username={user.username}
    />
    <UserNamesCell
      className="inUserProfile"
      name={user.name}
      username={user.username}
    >
      {user.relationshipPriority !== 'self' ?
        <RelationshipContainer
          hasBlockMuteButton
          className="inUserProfile"
          relationshipPriority={user.relationshipPriority}
          user={user}
        /> : null
      }
    </UserNamesCell>
    <UserDirtCell
      className="inUserProfile"
      onClickShareProfile={onClickShareProfile}
      totalViewsCount={user.totalViewsCount || '2.3m'}
    />
    <UserStatsCell
      className="inUserProfile"
      followersCount={user.followersCount}
      followingCount={user.followingCount}
      lovesCount={user.lovesCount}
      postsCount={user.postsCount}
      username={user.username}
    />
    <UserInfoCell
      className="inUserProfile"
      location={user.location}
      shortBio={user.formattedShortBio}
    />
    <UserLinksCell
      className="inUserProfile"
      externalLinksList={user.externalLinksList}
    />
    <UserProfileButtons
      className="inUserProfile"
      onClickHireMe={user.isHireable ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfile"
        relationshipPriority={user.relationshipPriority}
        user={user}
      />
    </UserProfileButtons>
  </div>

UserProfile.propTypes = {
  onClickHireMe: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  user: PropTypes.object,
}

