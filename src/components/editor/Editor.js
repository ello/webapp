import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../../selectors/authentication'
import { selectIsOwnPage } from '../../selectors/profile'
import { selectPostFromPropsPostId, selectIsOwnPost } from '../../selectors/post'
import { openModal, closeModal } from '../../actions/modals'
import {
  createComment,
  toggleEditing as toggleCommentEditing,
  updateComment,
} from '../../actions/comments'
import {
  createPost,
  toggleEditing,
  toggleReposting,
  updatePost,
} from '../../actions/posts'
import { resetEditor, initializeEditor } from '../../actions/editor'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './BlockCollection'
import ConfirmDialog from '../dialogs/ConfirmDialog'

const editorUniqueIdentifiers = {}
export function getEditorId(post, comment, isComment, isZero) {
  const prefix = isComment ? 'commentEditor' : 'postEditor'
  let modelId = ''
  if (post) {
    modelId = post.id
  } else if (comment) {
    modelId = `${comment.postId}_${comment.id}`
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
    isLoggedIn: selectIsLoggedIn(state),
    post: selectPostFromPropsPostId(state, props),
    isOwnPage: selectIsOwnPage(state),
    isOwnPost: selectIsOwnPost(state, props),
  }
}

class Editor extends Component {

  static propTypes = {
    autoPopulate: PropTypes.string,
    comment: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isComment: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isOwnPage: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    onSubmit: PropTypes.func,
    post: PropTypes.object,
    shouldLoadFromState: PropTypes.bool,
    shouldPersist: PropTypes.bool,
  }

  static defaultProps = {
    autoPopulate: null,
    isComment: false,
    isOwnPage: false,
    isPostDetail: false,
    shouldLoadFromState: false,
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
    const { comment, dispatch, isComment, isOwnPage, onSubmit, post } = this.props
    if (isComment) {
      if (comment && comment.isEditing) {
        dispatch(toggleCommentEditing(comment, false))
        dispatch(updateComment(comment, data, this.getEditorIdentifier()))
      } else {
        dispatch(createComment(data, this.getEditorIdentifier(), post.id))
      }
    } else if (!post) {
      dispatch(closeOmnibar())
      dispatch(createPost(data, this.getEditorIdentifier()))
    } else if (post.isEditing) {
      dispatch(toggleEditing(post, false))
      dispatch(updatePost(post, data, this.getEditorIdentifier()))
    } else if (post.isReposting) {
      dispatch(toggleReposting(post, false))
      const repostId = post.repostId || post.id
      const repostedFromId = post.repostId ? post.id : null
      dispatch(createPost(data, this.getEditorIdentifier(),
        repostId, repostedFromId)
      )
    }
    if (onSubmit) { onSubmit() }
    // if on own page scroll down to top of post content
    if (isOwnPage) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    }
  }

  cancel = () => {
    const { comment, isComment, post } = this.props
    if (isComment) {
      if (comment && comment.isEditing) {
        this.launchCancelConfirm('edit')
      } else {
        this.launchCancelConfirm('comment')
      }
    } else if (!post) {
      this.launchCancelConfirm('post')
    } else if (post.isEditing) {
      this.launchCancelConfirm('edit')
    } else if (post.isReposting) {
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
    const { comment, dispatch, post } = this.props
    this.closeModal()
    dispatch(resetEditor(this.getEditorIdentifier()))
    dispatch(closeOmnibar())
    if (post) {
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
      isPostDetail,
      post,
      shouldLoadFromState,
      shouldPersist,
    } = this.props
    if (!isLoggedIn) { return null }
    let blocks = []
    let repostContent = []
    let submitText
    if (autoPopulate && !shouldPersist) {
      blocks = [{ kind: 'text', data: autoPopulate }]
      submitText = 'Post'
    } else if (isComment) {
      if (comment && comment.isEditing) {
        submitText = 'Update'
        blocks = comment.body
      } else {
        submitText = 'Comment'
      }
    } else if (!post) {
      submitText = 'Post'
    } else if (post.isReposting) {
      submitText = 'Repost'
      if (post.repostId) {
        repostContent = post.repostContent
      } else {
        repostContent = post.content
      }
    } else if (post.isEditing) {
      submitText = 'Update'
      if (post.repostContent && post.repostContent.length) {
        repostContent = post.repostContent
      }
      if (post.body) {
        blocks = post.body
      }
    }
    const editorId = this.getEditorIdentifier()
    const key = `${editorId}_${blocks.length + repostContent.length}`
    return (
      <BlockCollection
        blocks={blocks}
        cancelAction={this.cancel}
        editorId={editorId}
        isComment={isComment}
        isOwnPost={isOwnPost}
        isPostDetail={isPostDetail}
        key={key}
        post={post}
        repostContent={repostContent}
        shouldLoadFromState={shouldLoadFromState}
        shouldPersist={shouldPersist}
        submitAction={this.submit}
        submitText={submitText}
      />
    )
  }
}

export default connect(mapStateToProps)(Editor)

