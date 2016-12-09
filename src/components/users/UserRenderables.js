import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import { ShareIcon } from '../assets/Icons'
import Hint from '../hints/Hint'
import { loadUserDrawer } from '../../actions/user'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import {
  UserFeaturedButton,
  UserFiguresCell,
  UserInfoCell,
  UserLinksCell,
  UserLocationCell,
  UserNamesCell,
  UserNamesCellCard,
  UserProfileButtons,
  UserStatsCell,
} from './UserParts'

// -------------------------------------

export const UserAvatar = ({ user }) =>
  <Link className="UserAvatar" to={`/${user.get('username')}`}>
    <Avatar
      priority={user.get('relationshipPriority')}
      sources={user.get('avatar')}
      userId={`${user.get('id')}`}
      username={user.get('username')}
    />
    <Hint>{`@${user.get('username')}`}</Hint>
  </Link>

UserAvatar.propTypes = {
  user: PropTypes.object,
}

// -----------------

export const UserCompact = ({ user }) =>
  <div className="UserCompact">
    <div className="UserCompactHeader">
      <Link className="UserCompactUserLink truncate" to={`/${user.get('username')}`}>
        <Avatar
          priority={user.get('relationshipPriority')}
          sources={user.get('avatar')}
          userId={`${user.get('id')}`}
          username={user.get('username')}
        />
        <span className="UserCompactUsername">{`@${user.get('username')}`}</span>
      </Link>
    </div>
    <RelationshipContainer
      relationshipPriority={user.get('relationshipPriority')}
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

export const UserProfileCard = ({
  isMobile,
  onClickCollab,
  onClickHireMe,
  onClickOpenFeaturedModal,
  truncatedShortBio,
  user,
}) =>
  <div className="UserProfileCard" >
    <Avatar
      className="inUserProfileCard"
      priority={user.get('relationshipPriority')}
      size={isMobile ? 'regular' : 'large'}
      sources={user.get('avatar')}
      to={`/${user.get('username')}`}
      userId={`${user.get('id')}`}
      username={user.get('username')}
    />
    <UserProfileButtons
      className="inUserProfileCard"
      onClickCollab={user.get('isCollaborateable') ? onClickCollab : null}
      onClickHireMe={user.get('isHireable') ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfileCard"
        relationshipPriority={user.get('relationshipPriority')}
        user={user}
      />
    </UserProfileButtons>
    <UserNamesCellCard
      className="inUserProfileCard"
      name={user.get('name')}
      username={user.get('username')}
    />
    <UserStatsCell
      className="inUserProfileCard"
      followingCount={user.get('followingCount')}
      followersCount={user.get('followersCount')}
      lovesCount={user.get('lovesCount')}
      postsCount={user.get('postsCount')}
      username={user.get('username')}
    />
    { !isMobile ?
      <UserInfoCell
        className="inUserProfileCard"
        truncatedShortBio={truncatedShortBio}
      /> : null
    }
    <BackgroundImage
      className="hasOverlay6 inUserProfileCard"
      sources={user.get('coverImage')}
      to={`/${user.get('username')}`}
    />
    { onClickOpenFeaturedModal ?
      <UserFeaturedButton className="inUserProfileCard" onClick={onClickOpenFeaturedModal} />
      : null
    }
  </div>

UserProfileCard.propTypes = {
  isMobile: PropTypes.bool,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
  onClickOpenFeaturedModal: PropTypes.func,
  truncatedShortBio: PropTypes.string,
  user: PropTypes.object,
}

// -----------------

export const UserProfile = ({
  isLoggedIn,
  isMobile,
  onClickCollab,
  onClickHireMe,
  onClickOpenBio,
  onClickOpenFeaturedModal,
  onClickShareProfile,
  truncatedShortBio,
  useGif,
  user,
}) =>
  <div className="UserProfile">
    <Avatar
      alt={user.get('name') ? user.get('name') : user.get('username')}
      className="inUserProfile"
      priority={user.get('relationshipPriority')}
      size="large"
      sources={user.get('avatar')}
      useGif={useGif}
      userId={`${user.get('id')}`}
      username={user.get('username')}
    />
    <UserNamesCell
      className="inUserProfile"
      name={user.get('name')}
      username={user.get('username')}
    >
      {onClickOpenFeaturedModal && !user.get('totalPostViewsCount') ?
        <UserFeaturedButton className="inUserProfile withoutTotalViewCount" onClick={onClickOpenFeaturedModal} />
        : null
      }
      {isLoggedIn && user.get('relationshipPriority') !== 'self' ?
        <RelationshipContainer
          hasBlockMuteButton
          className="inUserProfile"
          relationshipPriority={user.get('relationshipPriority')}
          user={user}
        /> : null
      }
    </UserNamesCell>
    {user.totalPostViewsCount && Number(user.get('totalPostViewsCount')) > 0 ?
      <UserFiguresCell
        className="inUserProfile"
        onClickOpenFeaturedModal={onClickOpenFeaturedModal}
        onClickShareProfile={onClickShareProfile}
        totalPostViewsCount={user.totalPostViewsCount}
      /> :
      <button className="UserFiguresShareButton withoutTotalViewCount" onClick={onClickShareProfile} >
        <ShareIcon />
      </button>
    }
    <UserStatsCell
      className="inUserProfile"
      followersCount={user.get('followersCount')}
      followingCount={user.get('followingCount')}
      lovesCount={user.get('lovesCount')}
      postsCount={user.get('postsCount')}
      username={user.get('username')}
    />
    <UserLocationCell
      className="inUserProfile"
      location={user.get('location')}
    />
    <UserInfoCell
      className="inUserProfile"
      onClickOpenBio={onClickOpenBio}
      truncatedShortBio={truncatedShortBio}
    />
    <UserLinksCell
      className="inUserProfile"
      externalLinksList={user.get('externalLinksList')}
      isMobile={isMobile}
    />
    <UserProfileButtons
      className="inUserProfile"
      onClickCollab={user.get('isCollaborateable') ? onClickCollab : null}
      onClickHireMe={user.get('isHireable') ? onClickHireMe : null}
    >
      <RelationshipContainer
        className="isPill inUserProfile"
        relationshipPriority={user.get('relationshipPriority')}
        user={user}
      />
    </UserProfileButtons>
  </div>

UserProfile.propTypes = {
  isLoggedIn: PropTypes.bool,
  isMobile: PropTypes.bool,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
  onClickOpenBio: PropTypes.func,
  onClickOpenFeaturedModal: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  truncatedShortBio: PropTypes.string,
  useGif: PropTypes.bool,
  user: PropTypes.object,
}

