import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import set from 'lodash/set'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import {
  selectIsOwnOriginalPost,
  selectIsOwnPost,
  selectPostFromPropsPostId,
  selectPropsPostId,
  selectPropsPostToken,
} from '../selectors/post'
import { selectPathname, selectPreviousPath } from '../selectors/routing'
import {
  selectStreamType,
  selectStreamMappingType,
  selectStreamPostIdOrToken,
} from '../selectors/stream'
import * as postActions from '../actions/posts'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { PostTools } from '../components/posts/PostTools'

export function mapStateToProps(state, props) {
  const deviceSize = selectDeviceSize(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const post = selectPostFromPropsPostId(state, props)
  const propsPostId = selectPropsPostId(state, props)
  const propsPostToken = selectPropsPostToken(state, props)
  const streamType = selectStreamType(state)
  const streamMappingType = selectStreamMappingType(state)
  const streamPostIdOrToken = selectStreamPostIdOrToken(state)
  const isCommentsRequesting = streamType === ACTION_TYPES.LOAD_STREAM_REQUEST &&
                               streamMappingType === MAPPING_TYPES.COMMENTS &&
                               (`${streamPostIdOrToken}` === `${propsPostId}` ||
                                `${streamPostIdOrToken}` === `${propsPostToken}`)
  return {
    detailLink: `/${props.author.get('username')}/post/${post.get('token')}`,
    deviceSize,
    isCommentsRequesting,
    isLoggedIn,
    isMobile: deviceSize === 'mobile',
    isOwnOriginalPost: selectIsOwnOriginalPost(state, props),
    isOwnPost: selectIsOwnPost(state, props),
    isWatchingPost: isLoggedIn && post.get('watching'),
    pathname: selectPathname(state),
    postCommentsCount: post.get('commentsCount'),
    postLoved: post.get('loved'),
    postLovesCount: post.get('lovesCount'),
    postReposted: post.get('reposted'),
    postRepostsCount: post.get('repostsCount'),
    postShowComments: post.get('showComments', false),
    postShowLovers: post.get('showLovers', false),
    postShowReposters: post.get('showReposters', false),
    postViewsCountRounded: post.get('viewsCountRounded'),
    previousPath: selectPreviousPath(state),
  }
}

/* eslint-disable react/no-unused-prop-types */
class PostToolsContainer extends Component {

  static propTypes = {
    author: PropTypes.object.isRequired,
    deviceSize: PropTypes.string.isRequired,
    detailLink: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isRepostAnimating: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    postCommentsCount: PropTypes.number.isRequired,
    postLoved: PropTypes.bool.isRequired,
    postLovesCount: PropTypes.number.isRequired,
    postReposted: PropTypes.bool.isRequired,
    postRepostsCount: PropTypes.number.isRequired,
    postShowComments: PropTypes.bool.isRequired,
    postShowLovers: PropTypes.bool.isRequired,
    postShowReposters: PropTypes.bool.isRequired,
    postViewsCountRounded: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    previousPath: PropTypes.string,
  }

  static defaultProps = {
    previousPath: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    this.state = {
      isCommentsActive: false,
      isRepostAnimating: false,
      postShowComments: false,
      postShowLovers: false,
      postShowReposters: false,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.post, this.props.post) ||
      ['isCommentsRequesting', 'isGridMode', 'isLoggedIn', 'isRepostAnimating'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickToggleComments = () => {
    const { detailLink, dispatch, isLoggedIn, post, postShowComments } = this.props
    if (isLoggedIn) {
      const nextShowComments = !postShowComments
      this.setState({ isCommentsActive: nextShowComments })
      dispatch(postActions.toggleComments(post, nextShowComments))
    } else {
      dispatch(push(detailLink))
    }
  }

  onClickLovePost = () => {
    const { dispatch, isLoggedIn, post, postLoved } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (postLoved) {
      dispatch(postActions.unlovePost(post))
    } else {
      dispatch(postActions.lovePost(post))
      dispatch(trackEvent('web_production.post_actions_love'))
    }
  }

  onClickToggleLovers = () => {
    const { detailLink, dispatch, isGridMode, isLoggedIn,
            pathname, post, postShowLovers } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isGridMode && pathname !== detailLink) {
      dispatch(push(detailLink))
    } else {
      const showLovers = !postShowLovers
      dispatch(postActions.toggleLovers(post, showLovers))
    }
  }

  onClickToggleReposters = () => {
    const { detailLink, dispatch, isGridMode, isLoggedIn,
      pathname, post, postShowReposters } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isGridMode && pathname !== detailLink) {
      dispatch(push(detailLink))
    } else {
      const showReposters = !postShowReposters
      dispatch(postActions.toggleReposters(post, showReposters))
    }
  }

  onClickSharePost = () => {
    const { author, dispatch, post } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog author={author} post={post} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog'))
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

  onClickEditPost = () => {
    const { dispatch, post } = this.props
    dispatch(postActions.toggleEditing(post, true))
    dispatch(postActions.loadEditablePost(post.get('id')))
  }

  onClickRepostPost = () => {
    const { dispatch, isLoggedIn, post, postReposted } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (!postReposted) {
      dispatch(postActions.toggleReposting(post, true))
      dispatch(postActions.loadEditablePost(post.get('id')))
    }
  }

  onClickWatchPost = () => {
    const { dispatch, isLoggedIn, post, isWatchingPost } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isWatchingPost) {
      dispatch(postActions.unwatchPost(post))
      dispatch(trackEvent('unwatched-post'))
    } else {
      dispatch(postActions.watchPost(post))
      dispatch(trackEvent('watched-post'))
    }
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

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onSignUp = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('post-tools')
  }

  render() {
    const toolProps = {
      ...this.props,
      isCommentsActive: this.state.isCommentsActive,
      onClickDeletePost: this.onClickDeletePost,
      onClickEditPost: this.onClickEditPost,
      onClickFlagPost: this.onClickFlagPost,
      onClickLovePost: this.onClickLovePost,
      onClickRepostPost: this.onClickRepostPost,
      onClickWatchPost: this.onClickWatchPost,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: this.onClickToggleLovers,
      onClickToggleReposters: this.onClickToggleReposters,
    }
    return <PostTools {...toolProps} />
  }
}
/* eslint-enable react/no-unused-prop-types */

export default connect(mapStateToProps)(PostToolsContainer)

