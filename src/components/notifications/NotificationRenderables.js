import Immutable from 'immutable'
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { XIcon } from '../assets/Icons'
import ImageAsset from '../assets/ImageAsset'
import { regionItemsForNotifications } from '../regions/RegionRenderables'
import { Notification } from './Notification'

// HELPERS
function getActivityPath(user, post) {
  if (!user) { return '/' }
  if (!post) { return `/${user.get('username')}` }
  return `/${user.get('username')}/post/${post.get('token')}`
}

function parseSummary(post, path, assets) {
  return regionItemsForNotifications(post.get('summary'), path, assets)
}

function parseSummaryForCommentNotification(post, comment, path, assets) {
  const postContent = post.get('summary', Immutable.List())
  const commentContent = comment.get('summary', Immutable.List())
  const divider = Immutable.fromJS([{ kind: 'rule' }])
  const combined = postContent.concat(divider, commentContent)
  return regionItemsForNotifications(combined, path, assets)
}

const UserTextLink = ({ user }) => {
  if (!user) { return null }
  return (
    <Link to={getActivityPath(user)}>
      {`@${user.get('username')}`}
    </Link>
  )
}
UserTextLink.propTypes = {
  user: PropTypes.object,
}

const PostTextLink = ({ author, post, text = 'post' }) => {
  if (!post || !author) { return <span>{text}</span> }
  return (
    <Link to={getActivityPath(author, post)}>
      {text}
    </Link>
  )
}
PostTextLink.propTypes = {
  author: PropTypes.object,
  post: PropTypes.object,
  text: PropTypes.string,
}

export const AnnouncementNotification = (props, context) => {
  const re = new RegExp(ENV.AUTH_DOMAIN.replace('https://', ''))
  const isInternalLink = props.ctaHref && (props.ctaHref[0] === '/' || re.test(props.ctaHref))
  const isExternalLink = props.ctaHref && !isInternalLink
  let linkProps = null
  if (isInternalLink) {
    linkProps = {
      onClick: context.onClickAnnouncementNotification,
      to: props.ctaHref,
    }
  } else if (isExternalLink) {
    linkProps = {
      onClick: context.onClickAnnouncementNotification,
      href: props.ctaHref,
      rel: 'noopener noreferrer',
      target: '_blank',
    }
  }
  const image = props.src &&
    <ImageAsset
      alt={props.title || props.src}
      className={!isInternalLink && !isExternalLink ? 'AnnouncementNotificationAsset' : ''}
      src={props.src}
    />

  return (
    <div className={classNames('AnnouncementNotification', { hasAsset: props.src })}>
      {!isInternalLink && !isExternalLink && image}
      {isInternalLink && image &&
        <Link className="AnnouncementNotificationAsset js-ANCTA" {...linkProps} >
          {image}
        </Link>
      }
      {isExternalLink && image &&
        <a className="AnnouncementNotificationAsset js-ANCTA" {...linkProps} >
          {image}
        </a>
      }

      {props.title &&
        <h2 className="AnnouncementNotificationTitle">{props.title}</h2>
      }
      {props.body &&
        <div className="AnnouncementNotificationBody">{props.body}</div>
      }
      {isInternalLink &&
        <Link className="AnnouncementNotificationCTA js-ANCTA" {...linkProps} >
          {props.ctaCaption}
        </Link>
      }
      {isExternalLink &&
        <a className="AnnouncementNotificationCTA js-ANCTA" {...linkProps} >
          {props.ctaCaption}
        </a>
      }
      <button className="AnnouncementNotificationX" onClick={context.onClickAnnouncementNotification}>
        <XIcon />
      </button>
    </div>
  )
}

AnnouncementNotification.propTypes = {
  body: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  src: PropTypes.string,
  title: PropTypes.string,
}

AnnouncementNotification.contextTypes = {
  onClickAnnouncementNotification: PropTypes.func.isRequired,
}


// COMMENTS
export const CommentNotification = (props) => {
  const { assets, author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on your '}
        <PostTextLink author={parentPostAuthor} post={parentPost} />
        {'.'}
      </p>
    </Notification>
  )
}
CommentNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}

export const CommentMentionNotification = (props) => {
  const { assets, author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentMentionNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' mentioned you in a '}
        <PostTextLink author={parentPostAuthor} post={parentPost} text="comment" />
        {'.'}
      </p>
    </Notification>
  )
}
CommentMentionNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}

export const CommentOnOriginalPostNotification = (props) => {
  const { assets, author, comment, createdAt, repost, repostAuthor,
    repostedSource, repostedSourceAuthor } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummaryForCommentNotification(repostedSource, comment, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentOnPostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on '}
        <UserTextLink user={repostAuthor} />
        {'\'s '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {' of your '}
        <PostTextLink author={repostedSourceAuthor} post={repostedSource} />
        {'.'}
      </p>
    </Notification>
  )
}
CommentOnOriginalPostNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
}

export const CommentOnRepostNotification = (props) => {
  const { assets, author, comment, createdAt, repost, repostAuthor } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummaryForCommentNotification(repost, comment, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentOnRepostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on your '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {'.'}
      </p>
    </Notification>
  )
}
CommentOnRepostNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
}

// INVITATIONS
export const InvitationAcceptedNotification = ({ createdAt, user }) =>
  <Notification
    activityPath={getActivityPath(user)}
    className="InvitationAcceptedNotification"
    createdAt={createdAt}
    notifier={user}
  >
    <p>
      <UserTextLink user={user} />
      {' accepted your invitation.'}
    </p>
  </Notification>
InvitationAcceptedNotification.propTypes = {
  createdAt: PropTypes.string,
  user: PropTypes.object,
}

// LOVES
export const LoveNotification = ({ assets, author, createdAt, post, user }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved your '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}
LoveNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
  user: PropTypes.object,
}

export const LoveOnOriginalPostNotification = (props) => {
  const { assets, createdAt, repost, repostAuthor,
    repostedSource, repostedSourceAuthor, user } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveOnOriginalPostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved '}
        <UserTextLink user={repostAuthor} />
        {'\'s '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {' of your '}
        <PostTextLink author={repostedSourceAuthor} post={repostedSource} />
        {'.'}
      </p>
    </Notification>
  )
}
LoveOnOriginalPostNotification.propTypes = {
  assets: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
  user: PropTypes.object,
}

export const LoveOnRepostNotification = ({ assets, createdAt, repost, repostAuthor, user }) => {
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveOnRepostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved your '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {'.'}
      </p>
    </Notification>
  )
}
LoveOnRepostNotification.propTypes = {
  assets: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  user: PropTypes.object,
}

// RELATIONSHIPS
export const NewFollowerPost = ({ createdAt, user }) =>
  <Notification
    activityPath={getActivityPath(user)}
    className="NewFollowerPostNotification"
    createdAt={createdAt}
    notifier={user}
  >
    <p>
      <UserTextLink user={user} />
      {' started following you.'}
    </p>
  </Notification>
NewFollowerPost.propTypes = {
  createdAt: PropTypes.string,
  user: PropTypes.object,
}

export const NewFollowedUserPost = ({ createdAt, user }) =>
  <Notification
    activityPath={getActivityPath(user)}
    className="NewFollowedUserPostNotification"
    createdAt={createdAt}
    notifier={user}
  >
    <p>
      {'You started following '}
      <UserTextLink user={user} />
      {'.'}
    </p>
  </Notification>
NewFollowedUserPost.propTypes = {
  createdAt: PropTypes.string,
  user: PropTypes.object,
}

// MENTIONS
export const PostMentionNotification = ({ assets, author, createdAt, post }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="PostMentionNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' mentioned you in a '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}
PostMentionNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
}

// REPOSTS
export const RepostNotification = ({ assets, author, createdAt, post }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="RepostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' reposted your '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}
RepostNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
}

// WATCHES
export const WatchCommentNotification = (props) => {
  const { assets, author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="WatchCommentNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on a '}
        <PostTextLink author={parentPostAuthor} post={parentPost} />
        {' you\'re watching.'}
      </p>
    </Notification>
  )
}
WatchCommentNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}

export const WatchNotification = ({ assets, author, createdAt, post, user }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="WatchNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' is watching your '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}
WatchNotification.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
  user: PropTypes.object,
}

export const WatchOnOriginalPostNotification = (props) => {
  const { assets, createdAt, repost, repostAuthor,
    repostedSource, repostedSourceAuthor, user } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="WatchOnOriginalPostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' is watching '}
        <UserTextLink user={repostAuthor} />
        {'\'s '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {' of your '}
        <PostTextLink author={repostedSourceAuthor} post={repostedSource} />
        {'.'}
      </p>
    </Notification>
  )
}
WatchOnOriginalPostNotification.propTypes = {
  assets: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
  user: PropTypes.object,
}

export const WatchOnRepostNotification = ({ assets, createdAt, repost, repostAuthor, user }) => {
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath, assets)
  return (
    <Notification
      activityPath={activityPath}
      className="WatchOnRepostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' is watching your '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {'.'}
      </p>
    </Notification>
  )
}
WatchOnRepostNotification.propTypes = {
  assets: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  user: PropTypes.object,
}

