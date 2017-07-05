import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectHasAutoWatchEnabled, selectIsOwnPage } from 'ello-brains/selectors/profile'
import {
  selectPost,
  selectPostIsEditing,
  selectPostIsEmpty,
  selectPostIsOwn,
  selectPostIsReposting,
} from 'ello-brains/selectors/post'
import { openModal, closeModal } from 'ello-brains/actions/modals'
import {
  createComment,
  toggleEditing as toggleCommentEditing,
  updateComment,
} from 'ello-brains/actions/comments'
import {
  createPost,
  toggleEditing,
  toggleReposting,
  updatePost,
} from 'ello-brains/actions/posts'
import { resetEditor, initializeEditor } from 'ello-brains/actions/editor'
import { closeOmnibar } from 'ello-brains/actions/omnibar'
import BlockCollection from './BlockCollection'
import ConfirmDialog from '../dialogs/ConfirmDialog'

const editorUniqueIdentifiers = {}
export function getEditorId(post, comment, isComment, isZero) {
  const prefix = isComment ? 'commentEditor' : 'postEditor'
  let modelId = ''
  if (post && post.size) {
    modelId = post.get('id')
  } else if (comment && comment.size) {
    modelId = `${comment.get('postId')}_${comment.get('id')}`
  } else if (isZero) {
    modelId = 'Zero'
  } else {
    modelId = '0'
  }
  const fullPrefix = `${prefix}${modelId}`
  if ({}.hasOwnProperty.call(editorUniqueIdentifiers, fullPrefix)) {
    return editorUniqueIdentifiers[fullPrefix]
  }
  return fullPrefix
}

function mapStateToProps(state, props) {
  return {
    allowsAutoWatch: selectHasAutoWatchEnabled(state),
    isLoggedIn: selectIsLoggedIn(state),
    isOwnPage: selectIsOwnPage(state),
    isOwnPost: selectPostIsOwn(state, props),
    isPostEditing: selectPostIsEditing(state, props),
    isPostEmpty: selectPostIsEmpty(state, props),
    isPostReposting: selectPostIsReposting(state, props),
    post: selectPost(state, props),
  }
}

class Editor extends Component {

  static propTypes = {
    allowsAutoWatch: PropTypes.bool,
    autoPopulate: PropTypes.string,
    comment: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isComment: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isOwnPage: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isPostEditing: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    isPostReposting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
    post: PropTypes.object,
    shouldPersist: PropTypes.bool,
  }

  static defaultProps = {
    allowsAutoWatch: false,
    autoPopulate: null,
    comment: null,
    isComment: false,
    isLoggedIn: false,
    isOwnPage: false,
    isOwnPost: false,
    onSubmit: null,
    post: null,
    shouldPersist: false,
  }

  static contextTypes = {
    onClickScrollToContent: PropTypes.func,
  }

  componentWillMount() {
    const { dispatch, shouldPersist } = this.props
    dispatch(initializeEditor(this.getEditorIdentifier(), shouldPersist))
  }

  getEditorIdentifier() {
    const { autoPopulate, comment, isComment, post, shouldPersist } = this.props
    return getEditorId(post, comment, isComment, autoPopulate && !shouldPersist)
  }

  submit = (data) => {
    const {
      allowsAutoWatch,
      comment,
      dispatch,
      isComment,
      isOwnPage,
      isPostEmpty,
      onSubmit,
      post,
    } = this.props
    if (isComment) {
      if (comment && comment.get('isEditing')) {
        dispatch(toggleCommentEditing(comment, false))
        dispatch(updateComment(comment, data, this.getEditorIdentifier()))
      } else {
        dispatch(createComment(allowsAutoWatch, data, this.getEditorIdentifier(), post.get('id')))
      }
    } else if (isPostEmpty) {
      dispatch(closeOmnibar())
      dispatch(createPost(data, this.getEditorIdentifier()))
    } else if (post.get('isEditing')) {
      dispatch(toggleEditing(post, false))
      dispatch(updatePost(post, data, this.getEditorIdentifier()))
    } else if (post.get('isReposting')) {
      dispatch(toggleReposting(post, false))
      const repostId = post.get('repostId') || post.get('id')
      const repostedFromId = post.get('repostId') ? post.get('id') : null
      dispatch(createPost(data, this.getEditorIdentifier(),
        repostId, repostedFromId),
      )
    }
    if (onSubmit) { onSubmit() }
    // if on own page scroll down to top of post content
    if (isOwnPage && !isComment) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    }
  }

  cancel = () => {
    const { comment, isComment, isPostEmpty, post } = this.props
    if (isComment) {
      if (comment && comment.get('isEditing')) {
        this.launchCancelConfirm('edit')
      } else {
        this.launchCancelConfirm('comment')
      }
    } else if (isPostEmpty) {
      this.launchCancelConfirm('post')
    } else if (post.get('isEditing')) {
      this.launchCancelConfirm('edit')
    } else if (post.get('isReposting')) {
      this.launchCancelConfirm('repost')
    }
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  launchCancelConfirm = (label) => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title={`Cancel ${label}?`}
        onConfirm={this.cancelConfirmed}
        onDismiss={this.closeModal}
      />))
  }

  cancelConfirmed = () => {
    const { comment, dispatch, isPostEmpty, post } = this.props
    this.closeModal()
    dispatch(resetEditor(this.getEditorIdentifier()))
    dispatch(closeOmnibar())
    if (!isPostEmpty) {
      dispatch(toggleEditing(post, false))
      dispatch(toggleReposting(post, false))
    }
    if (comment) {
      dispatch(toggleCommentEditing(comment, false))
    }
  }

  render() {
    const {
      autoPopulate,
      comment,
      isComment,
      isLoggedIn,
      isOwnPost,
      isPostEditing,
      isPostEmpty,
      isPostReposting,
      post,
      shouldPersist,
    } = this.props
    if (!isLoggedIn) { return null }
    let blocks
    let repostContent
    let submitText
    if (autoPopulate && !shouldPersist) {
      blocks = Immutable.fromJS([{ kind: 'text', data: autoPopulate }])
      submitText = 'Post'
    } else if (isComment) {
      if (comment && comment.get('isEditing')) {
        submitText = 'Update'
        blocks = comment.get('body')
      } else {
        submitText = 'Comment'
      }
    } else if (isPostEmpty) {
      submitText = 'Post'
    } else if (post.get('isReposting')) {
      submitText = 'Repost'
      if (post.get('repostId')) {
        repostContent = post.get('repostContent')
      } else {
        repostContent = post.get('content')
      }
    } else if (post.get('isEditing')) {
      submitText = 'Update'
      if (post.get('repostContent') && post.get('repostContent').size) {
        repostContent = post.get('repostContent')
      }
      if (post.get('body')) {
        blocks = post.get('body')
      }
    }
    const editorId = this.getEditorIdentifier()
    const key = `${editorId}_${(blocks ? blocks.size : '') + (repostContent ? repostContent.size : '')}`
    return (
      <BlockCollection
        blocks={blocks}
        cancelAction={this.cancel}
        editorId={editorId}
        isComment={isComment}
        isOwnPost={isOwnPost}
        isPostEditing={isPostEditing}
        isPostReposting={isPostReposting}
        key={key}
        post={post}
        repostContent={repostContent}
        submitAction={this.submit}
        submitText={submitText}
      />
    )
  }
}

export default connect(mapStateToProps)(Editor)

