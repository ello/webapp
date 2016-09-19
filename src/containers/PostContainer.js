import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'
import { get } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectInnerHeight,
  selectIsGridMode,
} from '../selectors/gui'
import { selectPostFromPropsPostId } from '../selectors/post'
import { getLinkObject } from '../helpers/json_helper'
import Editor from '../components/editor/Editor'
import {
  CategoryHeader,
  CommentStream,
  PostBody,
  PostFooter,
  PostHeader,
  PostLoversDrawer,
  PostRepostersDrawer,
  RepostHeader,
} from '../components/posts/PostRenderables'

export function mapStateToProps(state, props) {
  const { json, routing: { location: { pathname } } } = state
  const post = selectPostFromPropsPostId(state, props)
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets
  const categories = post.links.categories
  const category = get(json, ['categories', categories ? categories[0] : null])
  const isOnFeaturedCategory = /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname)
  const isRepost = !!(post.repostContent && post.repostContent.length)
  const isEditing = post.isEditing || false
  const isReposting = post.isReposting || false
  const postBody = post.body
  const showEditor = !!((isEditing || isReposting) && postBody)
  const lovesCount = post.lovesCount
  const repostsCount = post.repostsCount
  const showCommentEditor = !showEditor && !props.isPostDetail && post.showComments
  const showComments = showCommentEditor && post.commentsCount > 0
  const isGridMode = props.isPostDetail ? false : selectIsGridMode(state)

  let newProps = {
    assets,
    author,
    categoryName: category ? category.name : null,
    categoryPath: category ? `/discover/${category.slug}` : null,
    columnWidth: selectColumnWidth(state),
    commentOffset: selectCommentOffset(state),
    commentsCount: post.commentsCount,
    contentWarning: post.contentWarning,
    contentWidth: selectContentWidth(state),
    innerHeight: selectInnerHeight(state),
    isGridMode,
    isOnFeaturedCategory,
    isRepost,
    isReposting,
    post,
    postBody,
    showCommentEditor,
    showComments,
    showEditor,
    showLovers: !showEditor && !isGridMode && post.showLovers && lovesCount > 0,
    showReposters: !showEditor && !isGridMode && post.showReposters && repostsCount > 0,
  }

  if (isRepost) {
    newProps = {
      ...newProps,
      authorLinkObject: post.repostAuthor || getLinkObject(post, 'repostAuthor', json) || author,
    }
  }

  return newProps
}

class PostContainer extends Component {
  static propTypes = {
    assets: PropTypes.object,
    author: PropTypes.object,
    authorLinkObject: PropTypes.object,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    columnWidth: PropTypes.number,
    commentOffset: PropTypes.number,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number,
    innerHeight: PropTypes.number,
    isGridMode: PropTypes.bool,
    isOnFeaturedCategory: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    isRepost: PropTypes.bool,
    isReposting: PropTypes.bool,
    post: PropTypes.object,
    postBody: PropTypes.array,
    showCommentEditor: PropTypes.bool,
    showComments: PropTypes.bool,
    showEditor: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      assets,
      author,
      categoryName,
      categoryPath,
      columnWidth,
      commentOffset,
      contentWarning,
      contentWidth,
      innerHeight,
      isGridMode,
      isOnFeaturedCategory,
      isPostDetail,
      isPostHeaderHidden,
      isRepost,
      isReposting,
      post,
      postBody,
      showCommentEditor,
      showComments,
      showEditor,
      showLovers,
      showReposters,
    } = this.props
    if (!post) { return null }

    let postHeader
    if (isRepost) {
      const { authorLinkObject } = this.props
      const reProps = { post, repostAuthor: authorLinkObject, repostedBy: author }
      postHeader = <RepostHeader {...reProps} />
    } else if (isPostHeaderHidden) {
      postHeader = null
    } else if (isOnFeaturedCategory && categoryName && categoryPath) {
      const catProps = { post, author, categoryName, categoryPath }
      postHeader = <CategoryHeader {...catProps} />
    } else {
      postHeader = <PostHeader post={post} author={author} isPostDetail={isPostDetail} />
    }

    const isRepostAnimating = isReposting && !postBody
    return (
      <div className={classNames('Post', { isPostHeaderHidden: isPostHeaderHidden && !isRepost })}>
        {postHeader}
        {showEditor ?
          <Editor post={post} /> :
          <PostBody
            assets={assets}
            author={author}
            columnWidth={columnWidth}
            commentOffset={commentOffset}
            contentWarning={contentWarning}
            contentWidth={contentWidth}
            innerHeight={innerHeight}
            isGridMode={isGridMode}
            post={post}
          />
        }
        <PostFooter
          author={author}
          isGridMode={isGridMode}
          isRepostAnimating={isRepostAnimating}
          post={post}
        />
        {showLovers ? <PostLoversDrawer post={post} /> : null}
        {showReposters ? <PostRepostersDrawer post={post} /> : null}
        {showCommentEditor ? <Editor post={post} isComment /> : null}
        {showComments ? <CommentStream post={post} author={author} /> : null}
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

