import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import set from 'lodash/set'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectAssets } from '../selectors/assets'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectDeviceSize,
  selectInnerHeight,
  selectIsMobile,
  selectScrollScreen,
} from '../selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostBody,
  selectPostCategoryName,
  selectPostCategorySlug,
  selectPostCommentsCount,
  selectPostContent,
  selectPostContentWarning,
  selectPostCreatedAt,
  selectPostDetailPath,
  selectPostIsCommentsRequesting,
  selectPostIsGridMode,
  selectPostIsOwn,
  selectPostIsOwnOriginal,
  selectPostIsRepost,
  selectPostIsReposting,
  selectPostIsWatching,
  selectPostLoved,
  selectPostLovesCount,
  selectPostRepostAuthorWithFallback,
  selectPostRepostContent,
  selectPostReposted,
  selectPostRepostsCount,
  selectPostShowCommentEditor,
  selectPostShowCommentsDrawer,
  selectPostShowEditor,
  selectPostShowLoversDrawer,
  selectPostShowRepostersDrawer,
  selectPostSummary,
  selectPostViewsCountRounded,
  selectPropsPostId,
} from '../selectors/post'
import { selectIsDiscoverRoot, selectIsPostDetail, selectPathname, selectPreviousPath } from '../selectors/routing'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import {
  deletePost,
  flagPost,
  loadEditablePost,
  lovePost,
  toggleComments,
  toggleEditing,
  toggleLovers,
  toggleReposters,
  toggleReposting,
  unlovePost,
  unwatchPost,
  watchPost,
} from '../actions/posts'
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

// TODO: Possibly create an individual mapStateToProps for each container
// instance. This will allow each component it's own private group of
// selectors. It would be good to measure this though, based on how these run
// we may not gain a whole lot from it.
export function mapStateToProps(state, props) {
  return {
    assets: selectAssets(state),
    author: selectPostAuthor(state, props),
    categoryName: selectPostCategoryName(state, props),
    categoryPath: selectPostCategorySlug(state, props),
    columnWidth: selectColumnWidth(state),
    commentOffset: selectCommentOffset(state),
    content: selectPostContent(state, props),
    contentWarning: selectPostContentWarning(state, props),
    contentWidth: selectContentWidth(state),
    detailPath: selectPostDetailPath(state, props),
    deviceSize: selectDeviceSize(state),
    innerHeight: selectInnerHeight(state),
    isCommentsRequesting: selectPostIsCommentsRequesting(state, props),
    isDiscoverRoot: selectIsDiscoverRoot(state, props),
    isGridMode: selectPostIsGridMode(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isOwnOriginalPost: selectPostIsOwnOriginal(state, props),
    isOwnPost: selectPostIsOwn(state, props),
    isPostDetail: selectIsPostDetail(state, props),
    isRepost: selectPostIsRepost(state, props),
    isReposting: selectPostIsReposting(state, props),
    isWatchingPost: selectPostIsWatching(state, props),
    pathname: selectPathname(state),
    post: selectPost(state, props),
    postBody: selectPostBody(state, props),
    postCommentsCount: selectPostCommentsCount(state, props),
    postCreatedAt: selectPostCreatedAt(state, props),
    postId: selectPropsPostId(state, props),
    postLoved: selectPostLoved(state, props),
    postLovesCount: selectPostLovesCount(state, props),
    postReposted: selectPostReposted(state, props),
    postRepostsCount: selectPostRepostsCount(state, props),
    postViewsCountRounded: selectPostViewsCountRounded(state, props),
    previousPath: selectPreviousPath(state),
    repostAuthor: selectPostRepostAuthorWithFallback(state, props),
    repostContent: selectPostRepostContent(state, props),
    scrollScreen: selectScrollScreen(state),
    showCommentEditor: selectPostShowCommentEditor(state, props),
    showComments: selectPostShowCommentsDrawer(state, props),
    showEditor: selectPostShowEditor(state, props),
    showLovers: selectPostShowLoversDrawer(state, props),
    showReposters: selectPostShowRepostersDrawer(state, props),
    summary: selectPostSummary(state, props),
  }
}

class PostContainer extends Component {

  static propTypes = {
    assets: PropTypes.object,
    author: PropTypes.object.isRequired,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isDiscoverRoot: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool,
    isRepost: PropTypes.bool.isRequired,
    isReposting: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    postBody: PropTypes.object,
    postCommentsCount: PropTypes.number,
    postCreatedAt: PropTypes.string,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool,
    postLovesCount: PropTypes.number,
    postReposted: PropTypes.bool,
    postRepostsCount: PropTypes.number,
    postViewsCountRounded: PropTypes.string,
    previousPath: PropTypes.string,
    repostAuthor: PropTypes.object,
    repostContent: PropTypes.object,
    scrollScreen: PropTypes.number.isRequired,
    showCommentEditor: PropTypes.bool.isRequired,
    showComments: PropTypes.bool.isRequired,
    showEditor: PropTypes.bool.isRequired,
    showLovers: PropTypes.bool.isRequired,
    showReposters: PropTypes.bool.isRequired,
    summary: PropTypes.object,
  }

  static defaultProps = {
    assets: null,
    categoryName: null,
    categoryPath: null,
    content: null,
    contentWarning: null,
    isPostHeaderHidden: false,
    postBody: null,
    postCommentsCount: null,
    postCreatedAt: null,
    postLoved: false,
    postLovesCount: null,
    postReposted: false,
    postRepostsCount: null,
    postViewsCountRounded: null,
    previousPath: null,
    repostAuthor: null,
    repostContent: null,
    summary: null,
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
      isOnScreen: false,
      showComments: false,
      showLovers: false,
      showReposters: false,
    }
  }

  componentDidMount() {
    this.activeScreen = Math.abs(Math.ceil(this.ref.offsetTop / this.props.innerHeight))
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { scrollScreen } = nextProps
    const { isOnScreen } = this.state
    const isActive = this.activeScreen === scrollScreen ||
      this.activeScreen + 1 === scrollScreen ||
      this.activeScreen - 1 === scrollScreen
    if (isActive && !isOnScreen) {
      // console.log('Coming on screen:', this.props.postId, scrollScreen)
      this.setState({ isOnScreen: true })
    } else if (!isActive && isOnScreen) {
      // console.log('Going off screen:', this.props.postId, scrollScreen)
      this.setState({ isOnScreen: false })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isOnScreen !== this.state.isOnScreen) { return true }
    if (!nextProps.post || nextProps.post.isEmpty()) { return false }
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
    const action = deletePost(post)
    if (pathname.match(post.get('token'))) {
      set(action, 'meta.successAction', replace(previousPath || '/'))
    }
    dispatch(action)
  }

  onClickEditPost = () => {
    const { dispatch, post } = this.props
    dispatch(toggleEditing(post, true))
    dispatch(loadEditablePost(post.get('id')))
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
    dispatch(flagPost(post, flag))
  }

  onClickLovePost = () => {
    const { dispatch, post, postLoved } = this.props
    if (postLoved) {
      dispatch(unlovePost(post))
    } else {
      dispatch(lovePost(post))
      dispatch(trackEvent('web_production.post_actions_love'))
    }
  }

  onClickRepostPost = () => {
    const { dispatch, post, postReposted } = this.props
    if (!postReposted) {
      dispatch(toggleReposting(post, true))
      dispatch(loadEditablePost(post.get('id')))
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
      dispatch(toggleComments(post, nextShowComments))
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
      dispatch(toggleLovers(post, nextShowLovers))
    }
  }

  onClickToggleReposters = () => {
    const { detailPath, dispatch, isGridMode, pathname, post, showReposters } = this.props
    if (isGridMode && pathname !== detailPath) {
      dispatch(push(detailPath))
    } else {
      const nextShowReposters = !showReposters
      dispatch(toggleReposters(post, nextShowReposters))
    }
  }

  onClickWatchPost = () => {
    const { dispatch, post, isWatchingPost } = this.props
    if (isWatchingPost) {
      dispatch(unwatchPost(post))
      dispatch(trackEvent('unwatched-post'))
    } else {
      dispatch(watchPost(post))
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
      detailPath,
      innerHeight,
      isCommentsRequesting,
      isDiscoverRoot,
      isGridMode,
      isLoggedIn,
      isMobile,
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
    console.log('render post')
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
    } else if (isDiscoverRoot && categoryName && categoryPath) {
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
      <div
        className={classNames('Post', { isPostHeaderHidden: isPostHeaderHidden && !isRepost })}
        ref={comp => (this.ref = comp)}
      >
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
            isOnScreen={this.state.isOnScreen}
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
            postCommentsCount={postCommentsCount}
            postId={postId}
          />
        }
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

