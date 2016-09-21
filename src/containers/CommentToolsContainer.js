import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import * as ACTION_TYPES from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsOwnComment } from '../selectors/comment'
import { selectDeviceSize, selectIsNavbarHidden } from '../selectors/gui'
import { selectIsOwnPost } from '../selectors/post'
import * as commentActions from '../actions/comments'
import { openModal, closeModal } from '../actions/modals'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import { getEditorId } from '../components/editor/Editor'
import { scrollToLastTextBlock } from '../vendor/jello'
import { CommentTools } from '../components/comments/CommentTools'


export function mapStateToProps(state, props) {
  const { comment, post } = props
  const isOwnComment = selectIsOwnComment(state, props)
  const isOwnPost = selectIsOwnPost(state, props)
  let canDeleteComment = isOwnPost
  if (post.repostId) {
    canDeleteComment = isOwnPost && comment.originalPostId === post.id
  }
  return {
    canDeleteComment,
    deviceSize: selectDeviceSize(state),
    isLoggedIn: selectIsLoggedIn(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isOwnComment,
  }
}

class CommentToolsContainer extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isNavbarHidden: PropTypes.bool,
    post: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isMoreToolActive !== nextState.isMoreToolActive) { return true }
    return shallowCompare(this, nextProps, nextState)
  }

  onClickMoreTool = () => {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  }

  onClickReplyToComment = () => {
    const { author, dispatch, isNavbarHidden, post } = this.props
    const editorId = getEditorId(post, null, true, false)
    dispatch({
      type: ACTION_TYPES.EDITOR.APPEND_TEXT,
      payload: {
        editorId,
        text: `@${author.username} `,
      },
    })
    scrollToLastTextBlock(editorId, isNavbarHidden)
  }

  onClickEditComment = () => {
    const { comment, dispatch } = this.props
    dispatch(commentActions.toggleEditing(comment, true))
    dispatch(commentActions.loadEditableComment(comment))
  }

  onClickFlagComment = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onCommentWasFlagged}
        onConfirm={this.onCloseModal}
      />))
  }

  onCommentWasFlagged = ({ flag }) => {
    const { dispatch, comment } = this.props
    dispatch(commentActions.flagComment(comment, flag))
  }

  onClickDeleteComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={this.onConfirmDeleteComment}
        onDismiss={this.onCloseModal}
      />))
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onConfirmDeleteComment = () => {
    const { comment, dispatch } = this.props
    this.onCloseModal()
    dispatch(commentActions.deleteComment(comment))
  }

  render() {
    const toolProps = {
      ...this.props,
      isMoreToolActive: this.state.isMoreToolActive,
      onClickDeleteComment: this.onClickDeleteComment,
      onClickEditComment: this.onClickEditComment,
      onClickFlagComment: this.onClickFlagComment,
      onClickMoreTool: this.onClickMoreTool,
      onClickReplyToComment: this.onClickReplyToComment,
    }
    return <CommentTools {...toolProps} />
  }

}

export default connect(mapStateToProps)(CommentToolsContainer)

