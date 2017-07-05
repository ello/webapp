// @flow
import { is } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import {
  selectEditorial,
  selectEditorialAnalyticsOptions,
  selectEditorialImageSource,
  selectEditorialKind,
  selectEditorialPath,
  selectEditorialPostId,
  selectEditorialPostStreamHref,
  selectEditorialUrl,
} from 'ello-brains/selectors/editorial'
import { selectDPI } from 'ello-brains/selectors/gui'
import { selectPost, selectPostAuthor, selectPostDetailPath, selectPostLoved } from 'ello-brains/selectors/post'
import type { EditorialProps } from 'ello-brains/types/flowtypes'
import { trackEvent } from 'ello-brains/actions/analytics'
import {
  ErrorEditorial,
  InviteEditorial,
  JoinEditorial,
  LinkEditorial,
  PostStream,
  PostEditorial,
} from '../components/editorials/EditorialRenderables'

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
      path: selectEditorialPath(state, props),
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
      !is(nextProps.sources, this.props.sources) ||
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
      case 'external':
      case 'internal':
        return <LinkEditorial {...props} />
      case 'invite':
        return <InviteEditorial {...props} />
      case 'join':
        return <JoinEditorial {...props} />
      case 'post':
        return <PostEditorial {...props} />
      case 'post_stream':
        return <PostStream {...props} />
      default:
        return <ErrorEditorial {...props} />
    }
  }
}

export default connect(makeMapStateToProps)(EditorialContainer)

