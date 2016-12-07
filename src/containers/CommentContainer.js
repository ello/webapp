import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
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
  const author = state.getIn(['json', MAPPING_TYPES.USERS, comment.authorId])
  const post = selectPropsPost(state, props) || state.getIn(['json', MAPPING_TYPES.POSTS, comment.postId])
  // TODO: this should get moved to a selector
  const assets = state.getIn(['json', 'assets'])
  return {
    assets,
    author,
    commentBody: comment.get('body'),
    currentUser: state.get('profile'),
    isEditing: comment.get('isEditing'),
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

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.comment) { return false }
    return shallowCompare(this, nextProps, nextState)
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

