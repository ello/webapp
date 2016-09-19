import React from 'react'
import { Link } from 'react-router'
import { get, uniqBy } from 'lodash'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import PostContainer from '../../containers/PostContainer'
import CommentContainer from '../../containers/CommentContainer'
import NotificationContainer from '../../containers/NotificationContainer'
import UserContainer from '../../containers/UserContainer'
import UserCard from '../users/UserCard'
import UserInvitee from '../users/UserInvitee'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { isElloAndroid } from '../../vendor/jello'

export function categoriesAsGrid(categories) {
  return (
    <div className="Categories asGrid">
      {categories.data.map((category, index) =>
        <Link
          className="CategoryLink"
          to={`/discover/${category.slug}`}
          key={`CategoryLink_${category.slug}_${index}`}
          style={{ backgroundImage: `url("${get(category, 'tileImage.large.url')}")` }}
        >
          <span className="CategoryLinkName">{category.name}</span>
        </Link>
      )}
    </div>
  )
}

// TODO: convert these into react components (@see UserVitals)
// to hopefully get better errors out of rendering streams
export function usersAsCards(users) {
  return (
    <div className="Cards">
      {users.data.map((user) =>
        <UserCard user={user} key={`userCard_${user.id}`} />
      )}
    </div>
  )
}

export function usersAsGrid(users) {
  return (
    <div className="Users asGrid">
      {users.data.map((user) =>
        <UserContainer user={user} key={`userGrid_${user.id}`} type="grid" />
      )}
    </div>
  )
}

export function usersAsInviteeList(invitations) {
  return (
    <div className="Users asInviteeList">
      {invitations.data.map((invitation) =>
        <UserInvitee
          invitation={invitation}
          key={`userInviteeList_${invitation.id}`}
        />
      )}
    </div>
  )
}

export function usersAsInviteeGrid(invitations) {
  return (
    <div className="Users asInviteeGrid">
      {invitations.data.map((invitation) =>
        <UserInvitee
          className="UserInviteeGrid"
          invitation={invitation}
          key={`userInviteeGrid_${invitation.id}`}
        />
      )}
    </div>
  )
}

export function postsAsGrid(posts, columnCount) {
  const columns = []
  for (let i = 0; i < columnCount; i++) {
    columns.push([])
  }
  Object.keys(posts.data).forEach((index) => {
    columns[index % columnCount].push(posts.data[index])
  })
  return (
    <div className="Posts asGrid">
      {columns.map((columnPosts, index) =>
        <div className="Column" key={`column_${index}`}>
          {columnPosts.map((post) =>
            <article className="PostGrid" key={`postsAsGrid_${post.id}`}>
              <PostContainer post={post} />
            </article>
          )}
        </div>
      )}
    </div>
  )
}

export function postsAsList(posts) {
  return (
    <div className="Posts asList">
      {posts.data.map((post) =>
        <article className="PostList" key={`postsAsList_${post.id}`}>
          <PostContainer post={post} />
        </article>
      )}
    </div>
  )
}

export function commentsAsList(post) {
  return comments => (
    <div>
      {comments.data.map(comment =>
        <CommentContainer
          comment={comment}
          isEditing={comment.isEditing}
          key={`commentContainer_${comment.id}`}
          post={post}
        />
      )}
    </div>
  )
}

export function notificationList(notifications) {
  return (
    <div className="Notifications">
      {notifications.data.map((notification, index) =>
        <NotificationContainer
          key={`notificationParser${index}_${notification ? notification.createdAt : Date.now()}`}
          notification={notification}
        />
      )}
    </div>
  )
}

export function userAvatars(users) {
  const uniqUsers = uniqBy(users.data, (user) => user.id)
  return (
    uniqUsers.map((user) =>
      <UserContainer user={user} key={`userAvatar_${user.id}`} type="avatar" />
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
            setting.items.map((item) =>
              <Preference
                definition={{ term: item.label, desc: item.info }}
                id={item.key}
                key={`preference_${item.key}`}
                onToggleChange={preferenceToggleChanged}
              />
            )
          }
        </TreePanel>
      )
      return arr
    })
  )
}

export function blockedMutedUserList(users) {
  return (
    users.data.map((user) =>
      <UserContainer user={user} key={`userCompact_${user.id}`} type="compact" />
    )
  )
}

