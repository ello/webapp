// @flow
import { is } from 'immutable'
import { createSelector } from 'reselect'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectDPI } from 'ello-brains/selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostAuthorUsername,
  selectPostDetailPath,
  selectPostFirstImage,
  selectPostId,
  selectPostIsEmpty,
  selectPostLoved,
} from 'ello-brains/selectors/post'
import { CuratedPost } from '../components/editorials/EditorialRenderables'

type Props = {
  dpi: string,
  detailPath: string,
  fallbackSources: string,
  onClickEditorial: () => {},
  isLoggedIn: boolean,
  isPostLoved: boolean,
  post: any,
  postAuthor: any,
  sources: any,
  title: string,
  trackOptions: any,
  username: string,
}

const selectEditorialTrackOptions = (state, props) => props.editorialTrackOptions || {}

const selectTrackOptions = createSelector(
  [selectEditorialTrackOptions, selectPostId], (editorialTrackOptions, postId) => ({
    ...(editorialTrackOptions || {}),
    ...(postId ? { postId } : {}),
  }),
)

const makeMapStateToProps = () => (
  (state: any, props: any) => ({
    detailPath: selectPostDetailPath(state, props),
    dpi: selectDPI(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPostEmpty: selectPostIsEmpty(state, props),
    isPostLoved: selectPostLoved(state, props),
    post: selectPost(state, props),
    postAuthor: selectPostAuthor(state, props),
    sources: selectPostFirstImage(state, props),
    trackOptions: selectTrackOptions(state, props),
    username: selectPostAuthorUsername(state, props),
  })
)

class CuratedPostContainer extends Component {
  props: Props

  static contextTypes = {
    onClickOpenSignupModal: PropTypes.func,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func,
    onClickSharePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    const { onClickOpenSignupModal } = this.context
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : onClickOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.isPostEmpty) { return false }
    return !is(nextProps.post, this.props.post)
  }

  onClickSharePost = () => {
    const { post, postAuthor, trackOptions } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor, trackOptions })
  }

  onClickLovePost = () => {
    const { isPostLoved, post, trackOptions } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'editorial-module-loved'
    toggleLovePost({ isLoved: isPostLoved, post, trackLabel, trackOptions })
  }

  render() {
    const props = {
      dpi: this.props.dpi,
      detailPath: this.props.detailPath,
      fallbackSources: this.props.fallbackSources,
      isPostLoved: this.props.isPostLoved,
      onClickEditorial: this.props.onClickEditorial,
      sources: this.props.sources,
      title: this.props.title,
      username: this.props.username,
    }
    return <CuratedPost {...props} />
  }
}

export default connect(makeMapStateToProps)(CuratedPostContainer)

