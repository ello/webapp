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

export function categoriesAsGrid(categories) {
  const renderArr = []
  categories.data.forEach((category, index) =>
    renderArr.push(
      <Link
        className="CategoryLink"
        to={`/discover/${category.get('slug')}`}
        key={`CategoryLink_${category.get('slug')}_${index}`}
        style={{ backgroundImage: `url("${category.getIn(['tileImage', 'large', 'url'])}")` }}
      >
        <span className="CategoryLinkName">{category.get('name')}</span>
      </Link>,
    ),
  )
  return <div className="Categories asGrid">{renderArr}</div>
}

export function usersAsGrid(users) {
  const renderArr = []
  users.data.forEach(user =>
    renderArr.push(
      <UserContainer user={user} key={`userGrid_${user.get('id')}`} type="grid" />,
    ),
  )
  return <div className="Users asGrid">{renderArr}</div>
}

export function usersAsInviteeList(invitations) {
  const renderArr = []
  invitations.data.forEach(invitation =>
    renderArr.push(
      <UserInvitee
        invitation={invitation}
        key={`userInviteeList_${invitation.get('id')}`}
      />,
    ),
  )
  return <div className="Users asInviteeList">{renderArr}</div>
}

export function usersAsInviteeGrid(invitations) {
  const renderArr = []
  invitations.data.forEach(invitation =>
    renderArr.push(
      <UserInvitee
        className="UserInviteeGrid"
        invitation={invitation}
        key={`userInviteeList_${invitation.get('id')}`}
      />,
    ),
  )
  return <div className="Users asInviteeGrid">{renderArr}</div>
}

export function postsAsGrid(posts, columnCount, isPostHeaderHidden = false) {
  const columns = []
  for (let i = 0; i < columnCount; i += 1) {
    columns.push([])
  }
  Object.keys(posts.data).forEach((index) => {
    columns[index % columnCount].push(posts.data[index])
  })
  const renderArr = columns.map((columnPosts, index) => {
    const colRenderArr = []
    columnPosts.forEach(post =>
      colRenderArr.push(
        <article className="PostGrid" key={`postsAsGrid_${post.get('id')}`}>
          <PostContainer post={post} isPostHeaderHidden={isPostHeaderHidden} />
        </article>,
      ),
    )
    return <div className="Column" key={`column_${index}`}>{colRenderArr}</div>
  })
  return <div className="Posts asGrid">{renderArr}</div>
}

export function postsAsList(posts, columnCount, isPostHeaderHidden = false) {
  const renderArr = []
  posts.data.forEach(post =>
    renderArr.push(
      <article className="PostList" key={`postsAsList_${post.get('id')}`}>
        <PostContainer post={post} isPostHeaderHidden={isPostHeaderHidden} />
      </article>,
    ),
  )
  return <div className="Posts asList">{renderArr}</div>
}

export function commentsAsList(post) {
  return (comments) => {
    const renderArr = []
    comments.data.forEach(comment =>
      renderArr.push(
        <CommentContainer
          comment={comment}
          isEditing={comment.get('isEditing')}
          key={`commentContainer_${comment.get('id')}`}
          post={post}
        />,
      ),
    )
    return <div>{renderArr}</div>
  }
}

export function notificationList(notifications) {
  const renderArr = []
  notifications.data.map((notification, index) =>
    renderArr.push(
      <NotificationContainer
        key={`notificationParser${index}_${notification.get('createdAt', Date.now())}`}
        notification={notification}
      />,
    ),
  )
  return <div className="Notifications">{renderArr}</div>
}

// TODO: finish converting these to immutable
export function userAvatars(users) {
  const uniqUsers = uniqBy(users.data, user => user.id)
  return (
    uniqUsers.map(user =>
      <UserContainer user={user} key={`userAvatar_${user.id}`} type="avatar" />,
    )
  )
}

export function profileToggles(settings) {
  return (
    settings.data.map((setting, index) => {
      if (!isElloAndroid() && setting.label.toLowerCase().indexOf('push') === 0) { return null }
      const arr = [<TreeButton key={`settingLabel${index}`}>{setting.label}</TreeButton>]
      arr.push(
        <TreePanel key={`settingItems${index}`}>
          {
            setting.items.map(item =>
              <Preference
                definition={{ term: item.label, desc: item.info }}
                id={item.key}
                key={`preference_${item.key}`}
                onToggleChange={preferenceToggleChanged}
              />,
            )
          }
        </TreePanel>,
      )
      return arr
    })
  )
}

export function blockedMutedUserList(users) {
  return (
    users.data.map(user =>
      <UserContainer user={user} key={`userCompact_${user.id}`} type="compact" />,
    )
  )
}

