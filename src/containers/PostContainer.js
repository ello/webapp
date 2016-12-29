import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectInnerHeight,
  selectIsMobile,
  selectIsGridMode,
} from '../selectors/gui'
import { selectPostFromPropsPostId } from '../selectors/post'
import { selectPathname } from '../selectors/routing'
import { selectJson } from '../selectors/store'
import { getLinkObject } from '../helpers/json_helper'
import { trackEvent } from '../actions/analytics'
import { watchPost, unwatchPost } from '../actions/posts'
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
import { WatchTool } from '../components/posts/PostTools'

export function mapStateToProps(state, props) {
  const json = selectJson(state)
  const pathname = selectPathname(state)
  const post = selectPostFromPropsPostId(state, props)
  const author = json.getIn([MAPPING_TYPES.USERS, post.get('authorId')])
  const assets = json.get('assets')
  const categories = post.getIn(['links', 'categories'])
  const category = json.getIn(['categories', categories ? categories.first() : null])
  const isLoggedIn = selectIsLoggedIn(state)
  const isOnFeaturedCategory = /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname)
  const isRepost = !!(post.get('repostContent') && post.get('repostContent').size)
  const isEditing = post.get('isEditing', false)
  const isReposting = post.get('isReposting', false)
  const postBody = post.get('body')
  const showEditor = !!((isEditing || isReposting) && postBody)
  const lovesCount = post.get('lovesCount')
  const repostsCount = post.get('repostsCount')
  const showCommentEditor = !showEditor && !props.isPostDetail && post.get('showComments')
  const showComments = showCommentEditor && post.get('commentsCount') > 0
  const isGridMode = props.isPostDetail ? false : selectIsGridMode(state)

  const newProps = {
    assets,
    author,
    categoryName: category ? category.get('name') : null,
    categoryPath: category ? `/discover/${category.get('slug')}` : null,
    columnWidth: selectColumnWidth(state),
    commentOffset: selectCommentOffset(state),
    commentsCount: post.get('commentsCount'),
    contentWarning: post.get('contentWarning'),
    contentWidth: selectContentWidth(state),
    innerHeight: selectInnerHeight(state),
    isGridMode,
    isLoggedIn,
    isMobile: selectIsMobile(state),
    isOnFeaturedCategory,
    isRepost,
    isReposting,
    isWatchingPost: isLoggedIn && post.watching,
    post,
    postBody,
    showCommentEditor,
    showComments,
    showEditor,
    showLovers: !showEditor && !isGridMode && post.get('showLovers') && lovesCount > 0,
    showReposters: !showEditor && !isGridMode && post.get('showReposters') && repostsCount > 0,
  }

  if (isRepost) {
    newProps.authorLinkObject = post.get('repostAuthor') || getLinkObject(post, 'repostAuthor', json) || author
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
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number,
    isGridMode: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isMobile: PropTypes.bool,
    isOnFeaturedCategory: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    isRepost: PropTypes.bool,
    isReposting: PropTypes.bool,
    isWatchingPost: PropTypes.bool,
    post: PropTypes.object,
    postBody: PropTypes.object,
    showCommentEditor: PropTypes.bool,
    showComments: PropTypes.bool,
    showEditor: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.assets, this.props.assets) ||
      !Immutable.is(nextProps.author, this.props.author) ||
      !Immutable.is(nextProps.post, this.props.post) ||
      ['columnWidth', 'contentWidth', 'innerHeight', 'isGridMode', 'isLoggedIn', 'isMobile'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickWatchPost = () => {
    const { dispatch, isLoggedIn, post, isWatchingPost } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isWatchingPost) {
      dispatch(unwatchPost(post))
      dispatch(trackEvent('unwatched-post'))
    } else {
      dispatch(watchPost(post))
      dispatch(trackEvent('watched-post'))
    }
  }

  onSignUp = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('post-tools')
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
      isMobile,
      isOnFeaturedCategory,
      isPostDetail,
      isPostHeaderHidden,
      isRepost,
      isReposting,
      isWatchingPost,
      post,
      postBody,
      showCommentEditor,
      showComments,
      showEditor,
      showLovers,
      showReposters,
    } = this.props
    if (!post || !post.get('id')) { return null }

    let postHeader
    if (isRepost) {
      const { authorLinkObject } = this.props
      const reProps = {
        inUserDetail: isPostHeaderHidden,
        post,
        repostAuthor: authorLinkObject,
        repostedBy: author,
      }
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
        {isMobile ?
          <WatchTool
            isMobile
            isWatchingPost={isWatchingPost}
            onClickWatchPost={this.onClickWatchPost}
          /> : null
        }
        {showCommentEditor ? <Editor post={post} isComment /> : null}
        {showComments ? <CommentStream post={post} author={author} /> : null}
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

