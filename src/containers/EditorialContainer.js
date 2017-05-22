// @flow
import { is } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectEditorial,
  selectEditorialAnalyticsOptions,
  selectEditorialImageSource,
  selectEditorialKind,
  selectEditorialPostId,
  selectEditorialPostStreamHref,
  selectEditorialUrl,
} from '../selectors/editorial'
import { selectDPI } from '../selectors/gui'
import { selectPost, selectPostAuthor, selectPostDetailPath, selectPostLoved } from '../selectors/post'
import {
  ExternalEditorial,
  CuratedEditorial,
  PostEditorial,
} from '../components/editorials/EditorialRenderables'
import type { EditorialProps } from '../types/flowtypes'

const makeMapStateToProps = () => (
  (state: any, props: EditorialProps) => {
    const editorial = selectEditorial(state, props)
    const postId = selectEditorialPostId(state, props)
    return {
      dpi: selectDPI(state),
      editorial,
      isLoggedIn: selectIsLoggedIn(state),
      isPostLoved: selectPostLoved(state, { postId }),
      kind: selectEditorialKind(state, props),
      post: selectPost(state, { postId }),
      postAuthor: selectPostAuthor(state, { postId }),
      postPath: selectPostDetailPath(state, { postId }),
      postStreamHref: selectEditorialPostStreamHref(state, props),
      sources: selectEditorialImageSource(state, props),
      url: selectEditorialUrl(state, props),
      trackOptions: selectEditorialAnalyticsOptions(state, props),
    }
  }
)

class EditorialContainer extends Component {
  props: EditorialProps

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func,
    onClickOpenSignupModal: PropTypes.func,
    onClickSharePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onClickOpenSignupModal,
      onClickOpenSignupModal: isLoggedIn ? null : this.onClickOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
    }
  }

  componentDidMount() {
    const { dispatch, trackOptions } = this.props
    dispatch(trackEvent('editorial-module-viewed', trackOptions))
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.editorialId !== this.props.editorialId ||
      !is(nextProps.editorial, this.props.editorial) ||
      !is(nextProps.post, this.props.post)
    )
  }

  onClickLovePost = () => {
    const { isPostLoved, post, trackOptions } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'editorial-module-loved'
    toggleLovePost({ isLoved: isPostLoved, post, trackLabel, trackOptions })
  }

  onClickOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('editorial')
  }

  onClickSharePost = () => {
    const { post, postAuthor, trackOptions } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor, trackOptions })
  }

  onClickEditorial = () => {
    const { dispatch, trackOptions } = this.props
    dispatch(trackEvent('editorial-module-clicked', trackOptions))
  }

  render() {
    const props = {
      ...this.props,
      onClickEditorial: this.onClickEditorial,
    }
    switch (this.props.kind) {
      case 'post_stream':
        return <CuratedEditorial {...props} />
      case 'external':
        return <ExternalEditorial {...props} />
      case 'post':
        return <PostEditorial {...props} />
      default:
        return null
    }
  }
}

export default connect(makeMapStateToProps)(EditorialContainer)

