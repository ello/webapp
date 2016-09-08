import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import Hint from '../hints/Hint'
import {
  BoltIcon,
  BubbleIcon,
  EyeIcon,
  FlagIcon,
  HeartIcon,
  PencilIcon,
  RepostIcon,
  ShareIcon,
  XBoxIcon,
} from '../posts/PostIcons'
import { numberToHuman } from '../../vendor/number_to_human'

const ViewsTool = ({ detailLink, isLoggedIn, postViewsCountRounded }) =>
  <span className={classNames('PostTool', 'ViewsTool', { isPill: isLoggedIn })}>
    <Link to={detailLink}>
      <EyeIcon />
      <span className="PostToolValue">{postViewsCountRounded}</span>
      <Hint>Views</Hint>
    </Link>
  </span>

ViewsTool.propTypes = {
  detailLink: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  postViewsCountRounded: PropTypes.string.isRequired,
}

const TimeAgoTool = ({ detailLink, post }) =>
  <span className="PostTool TimeAgoTool">
    <Link to={detailLink}>
      <span className="PostToolValue">{new Date(post.createdAt).timeAgoInWords()}</span>
      <Hint>Visit</Hint>
    </Link>
  </span>

TimeAgoTool.propTypes = {
  detailLink: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
}

const CommentTool = ({ detailLink, isLoggedIn, onClickToggleComments, postCommentsCount }) =>
  <span className="PostTool CommentTool" data-count={postCommentsCount} >
    {isLoggedIn ?
      <button onClick={onClickToggleComments} >
        <BubbleIcon />
        <span className="PostToolValue" >
          {numberToHuman(postCommentsCount, false)}
        </span>
        <Hint>Comment</Hint>
      </button> :
      <Link to={detailLink}>
        <BubbleIcon />
        <span className="PostToolValue" >
          {numberToHuman(postCommentsCount, false)}
        </span>
        <Hint>Comment</Hint>
      </Link>
    }
  </span>

CommentTool.propTypes = {
  detailLink: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickToggleComments: PropTypes.func.isRequired,
  postCommentsCount: PropTypes.number,
}

const LoveTool = ({ onClickLovePost, onClickToggleLovers, postLoved, postLovesCount }) =>
  <span className="PostTool LoveTool" data-count={postLovesCount}>
    <button
      className={classNames({ isActive: postLoved, hasPostToolDrawer: postLovesCount > 0 })}
      onClick={onClickLovePost}
    >
      <HeartIcon />
      <Hint>Love</Hint>
    </button>
    <button
      className={classNames({ isActive: postLoved }, 'PostToolDrawerButton')}
      onClick={onClickToggleLovers}
    >
      <span className="PostToolValue" >
        {numberToHuman(postLovesCount, false)}
      </span>
      <Hint>Loved by</Hint>
    </button>
  </span>

LoveTool.propTypes = {
  onClickLovePost: PropTypes.func.isRequired,
  onClickToggleLovers: PropTypes.func.isRequired,
  postLoved: PropTypes.bool,
  postLovesCount: PropTypes.number,
}

const RepostTool = ({
  isOwnPost,
  isRepostAnimating,
  onClickRepostPost,
  onClickToggleReposters,
  postReposted,
  postRepostsCount,
}) =>
  <span className="PostTool RepostTool" data-count={postRepostsCount}>
    <button
      className={classNames({ hasPostToolDrawer: postRepostsCount > 0 })}
      onClick={!isOwnPost ? onClickRepostPost : null}
      style={{ pointerEvents: isOwnPost || postReposted ? 'none' : null }}
    >
      <RepostIcon className={classNames({ isRepostAnimating })} />
      <Hint>Repost</Hint>
    </button>
    <button className="PostToolDrawerButton" onClick={onClickToggleReposters}>
      <span className="PostToolValue" >
        {numberToHuman(postRepostsCount, false)}
      </span>
      <Hint className="RepostedByHint">Reposted by</Hint>
    </button>
  </span>

RepostTool.propTypes = {
  isOwnPost: PropTypes.bool,
  isRepostAnimating: PropTypes.bool,
  onClickRepostPost: PropTypes.func.isRequired,
  onClickToggleReposters: PropTypes.func.isRequired,
  postReposted: PropTypes.bool,
  postRepostsCount: PropTypes.number,
}

const WatchTool = ({ isMobile, isWatchingPost, onClickWatchPost }) =>
  <span className={classNames('PostTool WatchTool', { isWatchingPost }, { isPill: isMobile })}>
    <button className={classNames({ isActive: isWatchingPost })} onClick={onClickWatchPost}>
      <BoltIcon />
      <Hint>{ isWatchingPost ? 'Watching' : 'Watch' }</Hint>
    </button>
  </span>

WatchTool.propTypes = {
  isMobile: PropTypes.bool,
  isWatchingPost: PropTypes.bool,
  onClickWatchPost: PropTypes.func.isRequired,
}

const ShareTool = ({ isLoggedIn, onClickSharePost }) =>
  <span className={classNames('PostTool', 'ShareTool', { isPill: !isLoggedIn })}>
    <button onClick={onClickSharePost}>
      <ShareIcon />
      <Hint>Share</Hint>
    </button>
  </span>

ShareTool.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onClickSharePost: PropTypes.func.isRequired,
}

const EditTool = ({ onClickEditPost }) =>
  <span className="PostTool EditTool ShyTool">
    <button onClick={onClickEditPost}>
      <PencilIcon />
      <Hint>Edit</Hint>
    </button>
  </span>

EditTool.propTypes = {
  onClickEditPost: PropTypes.func.isRequired,
}

const DeleteTool = ({ onClickDeletePost }) =>
  <span className="PostTool DeleteTool ShyTool">
    <button onClick={onClickDeletePost}>
      <XBoxIcon />
      <Hint>Delete</Hint>
    </button>
  </span>

DeleteTool.propTypes = {
  onClickDeletePost: PropTypes.func.isRequired,
}

const FlagTool = ({ onClickFlagPost }) =>
  <span className="PostTool FlagTool ShyTool">
    <button onClick={onClickFlagPost}>
      <FlagIcon />
      <Hint>Flag</Hint>
    </button>
  </span>

FlagTool.propTypes = {
  onClickFlagPost: PropTypes.func.isRequired,
}

export const PostTools = (props) => {
  const {
    author,
    isCommentsActive,
    isCommentsRequesting,
    isLoggedIn,
    isOwnPost,
    postRepostsCount,
    post,
  } = props
  const postId = post.id
  const cells = []
  cells.push(<ViewsTool key={`ViewsTool_${postId}`} {...props} />)
  cells.push(<TimeAgoTool key={`TimeAgoTool_${postId}`} {...props} />)
  if (author.hasCommentingEnabled) {
    cells.push(<CommentTool key={`CommentTool_${postId}`} {...props} />)
  }
  if (author.hasLovesEnabled) {
    cells.push(<LoveTool key={`LoveTool_${postId}`} {...props} />)
  }
  if (author.hasRepostingEnabled && !(isOwnPost && parseInt(postRepostsCount, 10) === 0)) {
    cells.push(<RepostTool key={`RepostTool_${postId}`} {...props} />)
  }

  if (!isOwnPost) {
    cells.push(<WatchTool key={`WatchTool_${postId}`} {...props} />)
  }

  if (author.hasSharingEnabled) {
    cells.push(<ShareTool key={`ShareTool_${postId}`} {...props} />)
  }
  if (isLoggedIn) {
    if (isOwnPost) {
      cells.push(<EditTool key={`EditTool_${postId}`} {...props} />)
      cells.push(<DeleteTool key={`DeleteTool_${postId}`} {...props} />)
    } else {
      cells.push(<FlagTool key={`FlagTool_${postId}`} {...props} />)
    }
  }
  return (
    <footer className={classNames('PostTools', { isCommentsRequesting }, { isCommentsActive })}>
      {cells}
    </footer>
  )
}

PostTools.propTypes = {
  author: PropTypes.object.isRequired,
  isCommentsActive: PropTypes.bool.isRequired,
  isCommentsRequesting: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isOwnPost: PropTypes.bool,
  post: PropTypes.object.isRequired,
  postRepostsCount: PropTypes.number,
}

export default PostTools

