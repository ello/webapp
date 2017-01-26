import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import set from 'lodash/set'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectDeviceSize,
  selectInnerHeight,
  selectIsMobile,
  selectIsGridMode,
} from '../selectors/gui'
import {
  selectIsOwnOriginalPost,
  selectIsOwnPost,
} from '../selectors/post'
import { selectPathname, selectPreviousPath } from '../selectors/routing'
import { selectJson } from '../selectors/store'
import {
  selectStreamType,
  selectStreamMappingType,
  selectStreamPostIdOrToken,
} from '../selectors/stream'
import { getLinkObject } from '../helpers/json_helper'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import * as postActions from '../actions/posts'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import Editor from '../components/editor/Editor'
import { HeartIcon, RepostIcon } from '../components/posts/PostIcons'
import {
  CategoryHeader,
  CommentStream,
  PostBody,
  PostHeader,
  RepostHeader,
} from '../components/posts/PostRenderables'
import { PostTools, WatchTool } from '../components/posts/PostTools'
import { UserDrawer } from '../components/users/UserRenderables'
import { postLovers, postReposters } from '../networking/api'

function getPostDetailPath(author, post) {
  return `/${author.get('username')}/post/${post.get('token')}`
}

export function mapStateToProps(state, props) {
  const { isPostDetail, postId } = props
  const isLoggedIn = selectIsLoggedIn(state)
  const json = selectJson(state)
  const pathname = selectPathname(state)
  const streamType = selectStreamType(state)
  const streamMappingType = selectStreamMappingType(state)
  const streamPostIdOrToken = selectStreamPostIdOrToken(state)

  const post = json.getIn([MAPPING_TYPES.POSTS, postId])
  const author = json.getIn([MAPPING_TYPES.USERS, post.get('authorId')])
  const assets = json.get('assets')

  const categories = post.getIn(['links', 'categories'])
  const category = json.getIn(['categories', categories ? categories.first() : null])
  const isEditing = post.get('isEditing', false)
  const isReposting = post.get('isReposting', false)
  const postBody = post.get('body')
  const postCommentsCount = post.get('commentsCount')
  const postLovesCount = post.get('lovesCount')
  const postRepostsCount = post.get('repostsCount')
  const postToken = post.get('token')

  const isGridMode = isPostDetail ? false : selectIsGridMode(state)
  const isOnFeaturedCategory = /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname)
  const isRepost = !!(post.get('repostContent') && post.get('repostContent').size)
  const showEditor = !!((isEditing || isReposting) && postBody)
  const showCommentEditor = !showEditor && !isPostDetail && post.get('showComments')
  const showComments = showCommentEditor && postCommentsCount > 0

  const newProps = {
    assets,
    author,
    categoryName: category ? category.get('name') : null,
    categoryPath: category ? `/discover/${category.get('slug')}` : null,
    columnWidth: selectColumnWidth(state),
    commentOffset: selectCommentOffset(state),
    commentsCount: post.get('commentsCount'),
    content: post.get('content'),
    contentWarning: post.get('contentWarning'),
    contentWidth: selectContentWidth(state),
    detailPath: getPostDetailPath(author, post),
    deviceSize: selectDeviceSize(state),
    innerHeight: selectInnerHeight(state),
    isCommentsRequesting: streamType === ACTION_TYPES.LOAD_STREAM_REQUEST &&
      streamMappingType === MAPPING_TYPES.COMMENTS &&
      (`${streamPostIdOrToken}` === `${postId}` ||
      `${streamPostIdOrToken}` === `${postToken}`),
    isGridMode,
    isLoggedIn,
    isMobile: selectIsMobile(state),
    isOnFeaturedCategory,
    isOwnOriginalPost: selectIsOwnOriginalPost(state, props),
    isOwnPost: selectIsOwnPost(state, props),
    isRepost,
    isReposting,
    isWatchingPost: isLoggedIn && post.get('watching'),
    pathname,
    post,
    postBody,
    postCommentsCount,
    postCreatedAt: post.get('createdAt'),
    postId,
    postLoved: post.get('loved'),
    postLovesCount,
    postReposted: post.get('reposted'),
    postRepostsCount: post.get('repostsCount'),
    postViewsCountRounded: post.get('viewsCountRounded'),
    previousPath: selectPreviousPath(state),
    repostContent: post.get('repostContent'),
    showCommentEditor,
    showComments,
    showEditor,
    showLovers: (!showEditor && !isGridMode && post.get('showLovers') && postLovesCount > 0) ||
      (!showEditor && !isGridMode && isPostDetail && postLovesCount > 0),
    showReposters: (!showEditor && !isGridMode && post.get('showReposters') && postRepostsCount > 0) ||
      (!showEditor && !isGridMode && isPostDetail && postRepostsCount > 0),
    summary: post.get('summary'),
  }

  if (isRepost) {
    newProps.repostAuthor = post.get('repostAuthor') || getLinkObject(post, 'repostAuthor', json) || author
  }

  return newProps
}

class PostContainer extends Component {

  static propTypes = {
    assets: PropTypes.object,
    author: PropTypes.object.isRequired,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isOnFeaturedCategory: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool.isRequired,
    isRepost: PropTypes.bool.isRequired,
    isReposting: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    postBody: PropTypes.object,
    postCommentsCount: PropTypes.number.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool.isRequired,
    postLovesCount: PropTypes.number.isRequired,
    postReposted: PropTypes.bool.isRequired,
    postRepostsCount: PropTypes.number.isRequired,
    postViewsCountRounded: PropTypes.string.isRequired,
    previousPath: PropTypes.string,
    repostAuthor: PropTypes.object,
    repostContent: PropTypes.object,
    showCommentEditor: PropTypes.bool,
    showComments: PropTypes.bool,
    showEditor: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
    summary: PropTypes.object.isRequired,
  }

  static defaultProps = {
    assets: null,
    categoryName: null,
    categoryPath: null,
    contentWarning: null,
    isPostDetail: false,
    isPostHeaderHidden: false,
    isWatchingPost: false,
    postBody: null,
    previousPath: null,
    repostAuthor: null,
    repostContent: null,
    showCommentEditor: false,
    showComments: false,
    showEditor: false,
    showLovers: false,
    showReposters: false,
  }


  static childContextTypes = {
    onClickDeletePost: PropTypes.func.isRequired,
    onClickEditPost: PropTypes.func.isRequired,
    onClickFlagPost: PropTypes.func.isRequired,
    onClickLovePost: PropTypes.func.isRequired,
    onClickRepostPost: PropTypes.func.isRequired,
    onClickSharePost: PropTypes.func.isRequired,
    onClickToggleComments: PropTypes.func.isRequired,
    onClickToggleLovers: PropTypes.func.isRequired,
    onClickToggleReposters: PropTypes.func.isRequired,
    onClickWatchPost: PropTypes.func.isRequired,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickDeletePost: this.onClickDeletePost,
      onClickEditPost: this.onClickEditPost,
      onClickFlagPost: this.onClickFlagPost,
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onOpenSignupModal,
      onClickRepostPost: isLoggedIn ? this.onClickRepostPost : this.onOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: isLoggedIn ? this.onClickToggleLovers : this.onOpenSignupModal,
      onClickToggleReposters: isLoggedIn ? this.onClickToggleReposters : this.onOpenSignupModal,
      onClickWatchPost: isLoggedIn ? this.onClickWatchPost : this.onOpenSignupModal,
    }
  }

  componentWillMount() {
    this.state = {
      isCommentsActive: false,
      showComments: false,
      showLovers: false,
      showReposters: false,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.post, this.props.post) ||
      ['columnWidth', 'contentWidth', 'innerHeight', 'isGridMode', 'isLoggedIn', 'isMobile'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickDeletePost = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Post?"
        onConfirm={this.onConfirmDeletePost}
        onDismiss={this.onCloseModal}
      />))
  }

  onConfirmDeletePost = () => {
    const { dispatch, pathname, post, previousPath } = this.props
    this.onCloseModal()
    const action = postActions.deletePost(post)
    if (pathname.match(post.get('token'))) {
      set(action, 'meta.successAction', replace(previousPath || '/'))
    }
    dispatch(action)
  }

  onClickEditPost = () => {
    const { dispatch, post } = this.props
    dispatch(postActions.toggleEditing(post, true))
    dispatch(postActions.loadEditablePost(post.get('id')))
  }

  onClickFlagPost = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onPostWasFlagged}
        onConfirm={this.onCloseModal}
      />))
  }

  onPostWasFlagged = ({ flag }) => {
    const { dispatch, post } = this.props
    dispatch(postActions.flagPost(post, flag))
  }

  onClickLovePost = () => {
    const { dispatch, post, postLoved } = this.props
    if (postLoved) {
      dispatch(postActions.unlovePost(post))
    } else {
      dispatch(postActions.lovePost(post))
      dispatch(trackEvent('web_production.post_actions_love'))
    }
  }

  onClickRepostPost = () => {
    const { dispatch, post, postReposted } = this.props
    if (!postReposted) {
      dispatch(postActions.toggleReposting(post, true))
      dispatch(postActions.loadEditablePost(post.get('id')))
    }
  }

  onClickSharePost = () => {
    const { author, dispatch, post } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog author={author} post={post} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog'))
  }

  onClickToggleComments = () => {
    const { detailPath, dispatch, isLoggedIn, post, showComments } = this.props
    if (isLoggedIn) {
      const nextShowComments = !showComments
      this.setState({ isCommentsActive: nextShowComments })
      dispatch(postActions.toggleComments(post, nextShowComments))
    } else {
      dispatch(push(detailPath))
    }
  }

  onClickToggleLovers = () => {
    const { detailPath, dispatch, isGridMode, pathname, post, showLovers } = this.props
    if (isGridMode && pathname !== detailPath) {
      dispatch(push(detailPath))
    } else {
      const nextShowLovers = !showLovers
      dispatch(postActions.toggleLovers(post, nextShowLovers))
    }
  }

  onClickToggleReposters = () => {
    const { detailPath, dispatch, isGridMode, pathname, post, showReposters } = this.props
    if (isGridMode && pathname !== detailPath) {
      dispatch(push(detailPath))
    } else {
      const nextShowReposters = !showReposters
      dispatch(postActions.toggleReposters(post, nextShowReposters))
    }
  }

  onClickWatchPost = () => {
    const { dispatch, post, isWatchingPost } = this.props
    if (isWatchingPost) {
      dispatch(postActions.unwatchPost(post))
      dispatch(trackEvent('unwatched-post'))
    } else {
      dispatch(postActions.watchPost(post))
      dispatch(trackEvent('watched-post'))
    }
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
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
      content,
      contentWarning,
      contentWidth,
      innerHeight,
      isCommentsRequesting,
      isGridMode,
      isLoggedIn,
      isMobile,
      isOnFeaturedCategory,
      isOwnOriginalPost,
      isOwnPost,
      isPostDetail,
      isPostHeaderHidden,
      isRepost,
      isReposting,
      isWatchingPost,
      post,
      postBody,
      postCommentsCount,
      postCreatedAt,
      postId,
      postLoved,
      postLovesCount,
      postReposted,
      postRepostsCount,
      postViewsCountRounded,
      repostAuthor,
      repostContent,
      showCommentEditor,
      showComments,
      showEditor,
      showLovers,
      showReposters,
      summary,
    } = this.props
    if (!post || !post.get('id') || !author || !author.get('id')) { return null }
    const detailPath = getPostDetailPath(author, post)
    let postHeader
    const headerProps = { detailPath, postCreatedAt, postId }
    if (isRepost) {
      postHeader = (
        <RepostHeader
          {...headerProps}
          inUserDetail={isPostHeaderHidden}
          repostAuthor={repostAuthor}
          repostedBy={author}
        />
      )
    } else if (isPostHeaderHidden) {
      postHeader = null
    } else if (isOnFeaturedCategory && categoryName && categoryPath) {
      postHeader = (
        <CategoryHeader
          {...headerProps}
          author={author}
          categoryName={categoryName}
          categoryPath={categoryPath}
        />
      )
    } else {
      postHeader = (
        <PostHeader
          {...headerProps}
          author={author}
          isPostDetail={isPostDetail}
        />
      )
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
            content={content}
            contentWarning={contentWarning}
            contentWidth={contentWidth}
            detailPath={detailPath}
            innerHeight={innerHeight}
            isGridMode={isGridMode}
            isRepost={isRepost}
            postId={postId}
            repostContent={repostContent}
            summary={summary}
          />
        }
        <PostTools
          author={author}
          detailPath={detailPath}
          isCommentsActive={this.state.isCommentsActive}
          isCommentsRequesting={isCommentsRequesting}
          isGridMode={isGridMode}
          isLoggedIn={isLoggedIn}
          isMobile={isMobile}
          isOwnOriginalPost={isOwnOriginalPost}
          isOwnPost={isOwnPost}
          isRepostAnimating={isRepostAnimating}
          isWatchingPost={isWatchingPost}
          postCreatedAt={postCreatedAt}
          postCommentsCount={postCommentsCount}
          postId={postId}
          postLoved={postLoved}
          postLovesCount={postLovesCount}
          postReposted={postReposted}
          postRepostsCount={postRepostsCount}
          postViewsCountRounded={postViewsCountRounded}
        />
        {showLovers &&
          <UserDrawer
            endpoint={postLovers(postId)}
            icon={<HeartIcon />}
            key={`userAvatarsLovers_${postId}`}
            postId={postId}
            resultType="love"
          />
        }
        {showReposters &&
          <UserDrawer
            endpoint={postReposters(postId)}
            icon={<RepostIcon />}
            key={`userAvatarsReposters_${postId}`}
            postId={postId}
            resultType="repost"
          />
        }
        {isMobile &&
          <WatchTool
            isMobile
            isWatchingPost={isWatchingPost}
            onClickWatchPost={this.onClickWatchPost}
          />
        }
        {showCommentEditor && <Editor post={post} isComment />}
        {showComments &&
          <CommentStream
            detailPath={detailPath}
            post={post}
            postCommentsCount={postCommentsCount}
          />
        }
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

