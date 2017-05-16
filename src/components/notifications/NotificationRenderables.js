import Immutable from 'immutable'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router'
import { XIcon } from '../assets/Icons'
import ImageAsset from '../assets/ImageAsset'
import { regionItemsForNotifications } from '../regions/RegionRenderables'
import { Notification } from './Notification'
import { css, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

// HELPERS
function getActivityPath(user, post) {
  if (!user || !user.get('id')) { return '/' }
  if (!post || !post.get('id')) { return `/${user.get('username')}` }
  return `/${user.get('username')}/post/${post.get('token')}`
}

function parseSummary(post, path) {
  return regionItemsForNotifications(post.get('summary'), path)
}

function parseSummaryForCommentNotification(post, comment, path) {
  const postContent = post.get('summary', Immutable.List())
  const commentContent = comment.get('summary', Immutable.List())
  const divider = Immutable.fromJS([{ kind: 'rule' }])
  const combined = postContent.concat(divider, commentContent)
  return regionItemsForNotifications(combined, path)
}

const UserTextLink = ({ user }) => {
  if (!user || !user.get('id')) { return null }
  return (
    <Link to={getActivityPath(user)}>
      {`@${user.get('username')}`}
    </Link>
  )
}
UserTextLink.propTypes = {
  user: PropTypes.object,
}
UserTextLink.defaultProps = {
  user: null,
}

const PostTextLink = ({ author, post, text }) => {
  if (!post || !post.get('id') || !author) { return <span>{text}</span> }
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
PostTextLink.defaultProps = {
  author: null,
  post: null,
  text: 'post',
}

const announcementNotificationStyle = css(
  s.relative,
  s.p10,
  { marginTop: 1 },
  s.fontSize14,
  s.colorWhite,
  s.bgcBlack,
  modifier('.hasAsset', { minHeight: 100, paddingLeft: 90 }),
  modifier('.isStaffPreview', s.bgcRed),
)

const announcementNotificationAssetStyle = css(
  s.absolute,
  { top: 10, left: 10, width: 70 },
  s.overflowHidden,
)

const announcementNotificationTitleStyle = css(
  { maxWidth: 'calc(100% - 15px)', marginBottom: 15 },
  s.sansBold,
  s.fontSize16,
)

const announcementNotificationBodyStyle = css({ marginBottom: 15 })
const announcementNotificationCTAStyle = css(s.inline, s.borderBottom)
const announcementNotificationXStyle = css(s.absolute, { top: 10, right: 10 })

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
      className={!isInternalLink && !isExternalLink ? `${announcementNotificationAssetStyle}` : ''}
      src={props.src}
    />

  return (
    <div
      className={classNames(
        `${announcementNotificationStyle}`,
        { hasAsset: props.src, isStaffPreview: props.isStaffPreview },
      )}
    >
      {!isInternalLink && !isExternalLink && image}
      {isInternalLink && image &&
        <Link className={`${announcementNotificationAssetStyle} js-ANCTA`} {...linkProps} >
          {image}
        </Link>
      }
      {isExternalLink && image &&
        <a className={`${announcementNotificationAssetStyle} js-ANCTA`} {...linkProps} >
          {image}
        </a>
      }

      {props.title &&
        <h2 className={announcementNotificationTitleStyle}>{props.title}</h2>
      }
      {props.body &&
        <div className={announcementNotificationBodyStyle}>{props.body}</div>
      }
      {isInternalLink &&
        <Link className={`${announcementNotificationCTAStyle} js-ANCTA`} {...linkProps} >
          {props.ctaCaption}
        </Link>
      }
      {isExternalLink &&
        <a className={`${announcementNotificationCTAStyle} js-ANCTA`} {...linkProps} >
          {props.ctaCaption}
        </a>
      }
      <button className={`${announcementNotificationXStyle} js-closeAnnouncement`} onClick={context.onClickAnnouncementNotification}>
        <XIcon />
      </button>
    </div>
  )
}

AnnouncementNotification.propTypes = {
  body: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  isStaffPreview: PropTypes.boolean,
  src: PropTypes.string,
  title: PropTypes.string,
}
AnnouncementNotification.defaultProps = {
  body: null,
  ctaCaption: null,
  ctaHref: null,
  isStaffPreview: false,
  src: null,
  title: null,
}
AnnouncementNotification.contextTypes = {
  onClickAnnouncementNotification: PropTypes.func.isRequired,
}


// COMMENTS
export const CommentNotification = (props) => {
  const { author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath)
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
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}
CommentNotification.defaultProps = {
  author: null,
  comment: null,
  createdAt: null,
  parentPost: null,
  parentPostAuthor: null,
}

export const CommentMentionNotification = (props) => {
  const { author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath)
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
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}
CommentMentionNotification.defaultProps = {
  author: null,
  comment: null,
  createdAt: null,
  parentPost: null,
  parentPostAuthor: null,
}

export const CommentOnOriginalPostNotification = (props) => {
  const { author, comment, createdAt, repost, repostAuthor,
    repostedSource, repostedSourceAuthor } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummaryForCommentNotification(repostedSource, comment, activityPath)
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
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
}
CommentOnOriginalPostNotification.defaultProps = {
  author: null,
  comment: null,
  createdAt: null,
  repost: null,
  repostAuthor: null,
  repostedSource: null,
  repostedSourceAuthor: null,
}

export const CommentOnRepostNotification = (props) => {
  const { author, comment, createdAt, repost, repostAuthor } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummaryForCommentNotification(repost, comment, activityPath)
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
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
}
CommentOnRepostNotification.defaultProps = {
  author: null,
  comment: null,
  createdAt: null,
  repost: null,
  repostAuthor: null,
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
InvitationAcceptedNotification.defaultProps = {
  createdAt: null,
  user: null,
}

// LOVES
export const LoveNotification = ({ author, createdAt, post, user }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
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
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
  user: PropTypes.object,
}
LoveNotification.defaultProps = {
  author: null,
  createdAt: null,
  post: null,
  user: null,
}

export const LoveOnOriginalPostNotification = (props) => {
  const { createdAt, repost, repostAuthor, repostedSource, repostedSourceAuthor, user } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath)
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
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
  user: PropTypes.object,
}
LoveOnOriginalPostNotification.defaultProps = {
  createdAt: null,
  repost: null,
  repostAuthor: null,
  repostedSource: null,
  repostedSourceAuthor: null,
  user: null,
}

export const LoveOnRepostNotification = ({ createdAt, repost, repostAuthor, user }) => {
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath)
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
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  user: PropTypes.object,
}
LoveOnRepostNotification.defaultProps = {
  createdAt: null,
  repost: null,
  repostAuthor: null,
  user: null,
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
NewFollowerPost.defaultProps = {
  createdAt: null,
  user: null,
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
NewFollowedUserPost.defaultProps = {
  createdAt: null,
  user: null,
}

// MENTIONS
export const PostMentionNotification = ({ author, createdAt, post }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
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
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
}
PostMentionNotification.defaultProps = {
  author: null,
  createdAt: null,
  post: null,
}

// REPOSTS
export const RepostNotification = ({ author, createdAt, post }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
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
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
}
RepostNotification.defaultProps = {
  author: null,
  createdAt: null,
  post: null,
}

// WATCHES
export const WatchCommentNotification = (props) => {
  const { author, comment, createdAt, parentPost, parentPostAuthor } = props
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath)
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
  author: PropTypes.object,
  comment: PropTypes.object,
  createdAt: PropTypes.string,
  parentPost: PropTypes.object,
  parentPostAuthor: PropTypes.object,
}
WatchCommentNotification.defaultProps = {
  author: null,
  comment: null,
  createdAt: null,
  parentPost: null,
  parentPostAuthor: null,
}

export const WatchNotification = ({ author, createdAt, post, user }) => {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
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
  author: PropTypes.object,
  createdAt: PropTypes.string,
  post: PropTypes.object,
  user: PropTypes.object,
}
WatchNotification.defaultProps = {
  author: null,
  createdAt: null,
  post: null,
  user: null,
}

export const WatchOnOriginalPostNotification = (props) => {
  const { createdAt, repost, repostAuthor,
    repostedSource, repostedSourceAuthor, user } = props
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath)
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
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedSource: PropTypes.object,
  repostedSourceAuthor: PropTypes.object,
  user: PropTypes.object,
}
WatchOnOriginalPostNotification.defaultProps = {
  createdAt: null,
  repost: null,
  repostAuthor: null,
  repostedSource: null,
  repostedSourceAuthor: null,
  user: null,
}

export const WatchOnRepostNotification = ({ createdAt, repost, repostAuthor, user }) => {
  const activityPath = getActivityPath(repostAuthor, repost)
  const summary = parseSummary(repost, activityPath)
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
  createdAt: PropTypes.string,
  repost: PropTypes.object,
  repostAuthor: PropTypes.object,
  user: PropTypes.object,
}
WatchOnRepostNotification.defaultProps = {
  createdAt: null,
  repost: null,
  repostAuthor: null,
  user: null,
}

