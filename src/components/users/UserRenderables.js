import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import CoverMini from '../assets/CoverMini'
import Hint from '../hints/Hint'
import { loadUserDrawer } from '../../actions/user'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MiniPillButton } from '../buttons/Buttons'
import { ShareIcon } from './UserIcons'
import { UserDetailUserNames, UserNames, UserStats, UserInfo } from './UserVitals'

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

export const UserGrid = ({ user }) =>
  <div className="UserGrid" >
    <CoverMini to={`/${user.username}`} coverImage={user.coverImage} />
    <Avatar
      priority={user.relationshipPriority}
      sources={user.avatar}
      to={`/${user.username}`}
      userId={`${user.id}`}
      username={user.username}
    />
    <RelationshipContainer
      user={user}
      relationshipPriority={user.relationshipPriority}
    />
    <UserStats
      followingCount={user.followingCount}
      followersCount={user.followersCount}
      lovesCount={user.lovesCount}
      postsCount={user.postsCount}
      username={user.username}
    />
    <UserNames user={user} />
    <UserInfo user={user} />
  </div>

UserGrid.propTypes = {
  user: PropTypes.object,
}

export const UserProfile = props => {
  const { user, onClickHireMe, onClickShareProfile } = props
  return (
    <div className="UserProfile">
      <Avatar
        alt={user.name ? user.name : user.username}
        className="isLarge"
        priority={user.relationshipPriority}
        size="large"
        sources={user.avatar}
        to={`/${user.username}`}
        useGif={(user.viewsAdultContent || !user.postsAdultContent)}
        userId={user.id}
        username={user.username}
      />
      <RelationshipContainer
        hasBlockMuteButton
        relationshipPriority={user.relationshipPriority}
        user={user}
      />
      <UserDetailUserNames user={user} />
      <UserStats
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        lovesCount={user.lovesCount}
        postsCount={user.postsCount}
        username={user.username}
      />
      <UserInfo user={user} />
      <div className="ProfileButtons">
        <button className="ProfileButtonsShareButton" onClick={onClickShareProfile} >
          <ShareIcon />
        </button>
        <MiniPillButton onClick={onClickShareProfile} >
          Share Profile
        </MiniPillButton>
        {user.isHireable ?
          <MiniPillButton onClick={onClickHireMe} >
            Hire Me
          </MiniPillButton> : null
        }
      </div>
    </div>
  )
}

UserProfile.propTypes = {
  onClickHireMe: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  user: PropTypes.object,
}

