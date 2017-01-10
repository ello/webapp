import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Hint from '../hints/Hint'
import {
  ChevronIcon,
  FlagIcon,
  PencilIcon,
  ReplyIcon,
  XBoxIcon,
} from '../posts/PostIcons'

const TimeAgoTool = ({ createdAt }) =>
  <span className="PostTool TimeAgoTool">
    <span className="PostToolValue">{new Date(createdAt).timeAgoInWords()}</span>
  </span>

TimeAgoTool.propTypes = {
  createdAt: PropTypes.string.isRequired,
}

const EditTool = ({ onClickEditComment }) =>
  <span className="PostTool EditTool ShyTool">
    <button onClick={onClickEditComment}>
      <PencilIcon />
      <Hint>Edit</Hint>
    </button>
  </span>

EditTool.propTypes = {
  onClickEditComment: PropTypes.func.isRequired,
}

const DeleteTool = ({ onClickDeleteComment }) =>
  <span className="PostTool DeleteTool ShyTool">
    <button onClick={onClickDeleteComment}>
      <XBoxIcon />
      <Hint>Delete</Hint>
    </button>
  </span>

DeleteTool.propTypes = {
  onClickDeleteComment: PropTypes.func.isRequired,
}

const ReplyTool = ({ onClickReplyToComment }) =>
  <span className="PostTool ReplyTool">
    <button onClick={onClickReplyToComment}>
      <ReplyIcon />
      <Hint>Reply</Hint>
    </button>
  </span>

ReplyTool.propTypes = {
  onClickReplyToComment: PropTypes.func.isRequired,
}

const FlagTool = ({ className, onClickFlagComment }) =>
  <span className={classNames('PostTool FlagTool ShyTool', className)}>
    <button onClick={onClickFlagComment}>
      <FlagIcon />
      <Hint>Flag</Hint>
    </button>
  </span>

FlagTool.propTypes = {
  className: PropTypes.string,
  onClickFlagComment: PropTypes.func.isRequired,
}
FlagTool.defaultProps = {
  className: null,
}

const MoreTool = ({ onClickMoreTool }) =>
  <span className="PostTool MoreTool">
    <button onClick={onClickMoreTool}>
      <ChevronIcon />
      <Hint>More</Hint>
    </button>
  </span>

MoreTool.propTypes = {
  onClickMoreTool: PropTypes.func.isRequired,
}

export const CommentTools = (props) => {
  const { canDeleteComment, comment, isLoggedIn, isMoreToolActive, isOwnComment } = props
  const { onClickEditComment, onClickDeleteComment, onClickReplyToComment,
          onClickFlagComment, onClickMoreTool } = props
  const cId = comment.get('id')
  const cells = []
  cells.push(<TimeAgoTool key={`TimeAgoTool_${cId}`} createdAt={comment.get('createdAt')} />)
  if (isLoggedIn) {
    if (isOwnComment) {
      cells.push(<EditTool key={`EditTool_${cId}`} onClickEditComment={onClickEditComment} />)
      cells.push(
        <DeleteTool key={`DeleteTool_${cId}`} onClickDeleteComment={onClickDeleteComment} />,
      )
    } else if (canDeleteComment) {
      cells.push(
        <ReplyTool key={`ReplyTool_${cId}`} onClickReplyToComment={onClickReplyToComment} />,
      )
      cells.push(
        <FlagTool key={`FlagTool_${cId}`} onClickFlagComment={onClickFlagComment} />,
      )
      cells.push(
        <DeleteTool key={`DeleteTool_${cId}`} onClickDeleteComment={onClickDeleteComment} />,
      )
    } else {
      cells.push(
        <ReplyTool key={`ReplyTool_${cId}`} onClickReplyToComment={onClickReplyToComment} />,
      )
      cells.push(
        <FlagTool
          key={`FlagTool_${cId}`}
          className="isSolo"
          onClickFlagComment={onClickFlagComment}
        />,
      )
    }
  }
  cells.push(<MoreTool key={`MoreTool_${cId}`} onClickMoreTool={onClickMoreTool} />)
  return (
    <footer className={classNames('PostTools', 'CommentTools', { isMoreToolActive })}>
      {cells}
    </footer>
  )
}

CommentTools.propTypes = {
  canDeleteComment: PropTypes.bool,
  comment: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  isMoreToolActive: PropTypes.bool,
  isOwnComment: PropTypes.bool,
  onClickDeleteComment: PropTypes.func.isRequired,
  onClickEditComment: PropTypes.func.isRequired,
  onClickFlagComment: PropTypes.func.isRequired,
  onClickMoreTool: PropTypes.func.isRequired,
  onClickReplyToComment: PropTypes.func.isRequired,
}
CommentTools.defaultProps = {
  canDeleteComment: false,
  isLoggedIn: false,
  isMoreToolActive: false,
  isOwnComment: false,
}

export default CommentTools

