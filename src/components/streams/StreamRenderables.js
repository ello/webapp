import React from 'react'
import { Link } from 'react-router'
import uniqBy from 'lodash/uniqBy'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import PostContainer from '../../containers/PostContainer'
import CommentContainer from '../../containers/CommentContainer'
import NotificationContainer from '../../containers/NotificationContainer'
import UserContainer from '../../containers/UserContainer'
import UserInvitee from '../users/UserInvitee'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { isElloAndroid } from '../../lib/jello'

export const categoriesAsGrid = categories =>
  <div className="Categories asGrid">
    {categories.data.map((category, index) =>
      <Link
        className="CategoryLink"
        to={`/discover/${category.get('slug')}`}
        key={`CategoryLink_${category.get('slug')}_${index}`}
        style={{ backgroundImage: `url("${category.getIn(['tileImage', 'large', 'url'])}")` }}
      >
        <span className="CategoryLinkName">{category.get('name')}</span>
      </Link>,
    )}
  </div>

export const usersAsGrid = users =>
  <div className="Users asGrid">
    {users.data.map(user =>
      <UserContainer user={user} key={`userGrid_${user.get('id')}`} type="grid" />,
    )}
  </div>

export const usersAsInviteeList = invitations =>
  <div className="Users asInviteeList">
    {invitations.data.map(invitation =>
      <UserInvitee
        invitation={invitation}
        key={`userInviteeList_${invitation.get('id')}`}
      />,
    )}
  </div>

export const usersAsInviteeGrid = invitations =>
  <div className="Users asInviteeGrid">
    {invitations.data.map(invitation =>
      <UserInvitee
        className="UserInviteeGrid"
        invitation={invitation}
        key={`userInviteeList_${invitation.get('id')}`}
      />,
    )}
  </div>

export const postsAsGrid = (posts, columnCount, isPostHeaderHidden = false) => {
  const columns = []
  for (let i = 0; i < columnCount; i += 1) {
    columns.push([])
  }
  Object.keys(posts.data).forEach((index) => {
    columns[index % columnCount].push(posts.data[index])
  })
  return (
    <div className="Posts asGrid">
      {columns.map((columnPosts, index) =>
        <div className="Column" key={`column_${index}`}>
          {columnPosts.map(post =>
            <article className="PostGrid" key={`postsAsGrid_${post.get('id')}`}>
              <PostContainer post={post} isPostHeaderHidden={isPostHeaderHidden} />
            </article>,
          )}
        </div>,
      )}
    </div>
  )
}

export const postsAsList = (posts, columnCount, isPostHeaderHidden = false) =>
  <div className="Posts asList">
    {posts.data.map(post =>
      <article className="PostList" key={`postsAsList_${post.get('id')}`}>
        <PostContainer post={post} isPostHeaderHidden={isPostHeaderHidden} />
      </article>,
    )}
  </div>

export const commentsAsList = post =>
  comments =>
    <div>
      {comments.data.map(comment =>
        <CommentContainer
          comment={comment}
          isEditing={comment.get('isEditing')}
          key={`commentContainer_${comment.get('id')}`}
          post={post}
        />,
      )}
    </div>

export const notificationList = notifications =>
  <div className="Notifications">
    {notifications.data.map((notification, index) =>
      <NotificationContainer
        key={`notificationParser${index}_${notification.get('createdAt', Date.now())}`}
        notification={notification}
      />,
    )}
  </div>

export const userAvatars = (users) => {
  const uniqUsers = uniqBy(users.data, user => user.get('id'))
  return (
    uniqUsers.map(user =>
      <UserContainer user={user} key={`userAvatar_${user.get('id')}`} type="avatar" />,
    )
  )
}

export const profileToggles = settings =>
  settings.data.map((setting, index) => {
    if (!isElloAndroid() && setting.get('label').toLowerCase().indexOf('push') === 0) { return null }
    const arr = [<TreeButton key={`settingLabel${index}`}>{setting.get('label')}</TreeButton>]
    arr.push(
      <TreePanel key={`settingItems${index}`}>
        {setting.get('items').map(item =>
          <Preference
            definition={{ term: item.get('label'), desc: item.get('info') }}
            id={item.get('key')}
            key={`preference_${item.get('key')}`}
            onToggleChange={preferenceToggleChanged}
          />,
        )}
      </TreePanel>,
    )
    return arr
  })

export const blockedMutedUserList = users =>
  users.data.map(user =>
    <UserContainer user={user} key={`userCompact_${user.get('id')}`} type="compact" />,
  )

