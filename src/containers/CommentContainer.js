import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectCommentFromPropsCommentId } from '../selectors/comment'
import { selectIsGridMode } from '../selectors/gui'
import { selectPropsPost } from '../selectors/post'
import Editor from '../components/editor/Editor'
import {
  CommentBody,
  CommentFooter,
  CommentHeader,
} from '../components/comments/CommentRenderables'

export function mapStateToProps(state, props) {
  const comment = selectCommentFromPropsCommentId(state, props)
  const author = state.json.getIn([MAPPING_TYPES.USERS, comment.get('authorId')])
  const post = selectPropsPost(state, props) ||
    state.json.getIn([MAPPING_TYPES.POSTS, comment.get('postId')])
  // TODO: this should get moved to a selector
  const assets = state.json.get('assets')
  return {
    assets,
    author,
    commentBody: comment.get('body'),
    currentUser: state.profile,
    isEditing: comment.get('isEditing', false),
    isGridMode: selectIsGridMode(state),
    post,
  }
}

class CommentContainer extends Component {

  static propTypes = {
    assets: PropTypes.object,
    author: PropTypes.object,
    comment: PropTypes.object,
    commentBody: PropTypes.array,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridMode: PropTypes.bool,
    post: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.comment) { return false }
    return true
  }

  render() {
    const { comment, assets, author, commentBody,
      currentUser, isEditing, isGridMode, post } = this.props
    if (!comment) { return null }
    return (
      <div>
        {!isEditing ?
          <CommentHeader author={author} comment={comment} /> :
          null
        }
        {isEditing && commentBody ?
          <Editor isComment comment={comment} /> :
          <CommentBody
            assets={assets}
            author={author}
            comment={comment}
            currentUser={currentUser}
            isGridMode={isGridMode}
            post={post}
          />
        }
        <CommentFooter
          author={author}
          comment={comment}
          currentUser={currentUser}
          post={post}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CommentContainer)

