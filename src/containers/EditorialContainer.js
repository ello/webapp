// @flow
import { is } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
import { lovePost, unlovePost } from '../actions/posts'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectEditorial, selectEditorialPostId } from '../selectors/editorial'
import { selectPost, selectPostAuthor, selectPostDetailPath, selectPostLoved } from '../selectors/post'
import ShareDialog from '../components/dialogs/ShareDialog'
import {
  ExternalEditorial,
  CuratedPostEditorial,
  PostEditorial,
} from '../components/editorials/EditorialRenderables'
import type { EditorialProps } from '../types/flowtypes'

// TODO: Selectors!
const makeMapStateToProps = () => (
  (state: any, props: EditorialProps) => {
    const editorial = selectEditorial(state, props)
    const postId = selectEditorialPostId(state, props)
    return {
      editorial,
      isLoggedIn: selectIsLoggedIn(state),
      isPostLoved: selectPostLoved(state, { postId }),
      post: selectPost(state, { postId }),
      postAuthor: selectPostAuthor(state, { postId }),
      postPath: selectPostDetailPath(state, { postId }),
    }
  }
)

class EditorialContainer extends Component {
  props: EditorialProps

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func,
    onClickOpenSignupModal: PropTypes.func,
    onClickSharePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickOpenSignupModal: isLoggedIn ? null : this.onClickOpenSignupModal,
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onClickOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
    }
  }
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.editorialId !== this.props.editorialId ||
      !is(nextProps.editorial, this.props.editorial) ||
      !is(nextProps.post, this.props.post)
    )
  }

  onClickLovePost = () => {
    const { dispatch, isPostLoved, post } = this.props
    if (isPostLoved) {
      dispatch(unlovePost(post))
    } else {
      dispatch(lovePost(post))
    }
  }


  onClickOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('editorial')
  }

  onClickSharePost = () => {
    const { dispatch, post, postAuthor } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(
      <ShareDialog author={postAuthor} post={post} trackEvent={action} />,
      '',
      null,
      'open-share-dialog'),
    )
  }

  render() {
    switch (this.props.editorial.get('kind')) {
      case 'post_stream':
        return <CuratedPostEditorial {...this.props} />
      case 'external':
        return <ExternalEditorial {...this.props} />
      case 'post':
      default:
        return <PostEditorial {...this.props} />
    }
  }
}

export default connect(makeMapStateToProps)(EditorialContainer)

