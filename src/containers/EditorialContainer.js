// @flow
import { is, Map } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
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
    const editorial = state.json.getIn(['editorials', props.editorialId], Map())
    const postId = editorial.getIn(['links', 'post', 'id'])
    return {
      editorial,
      isPostLoved: selectPostLoved(state, { postId }),
      post: selectPost(state, { postId }),
      postAuthor: selectPostAuthor(state, { postId }),
      postPath: selectPostDetailPath(state, { postId }),
    }
  }
)

class EditorialContainer extends Component {
  props: EditorialProps

  static childContextTypes = {
    // onClickLovePost: PropTypes.func.isRequired,
    onClickSharePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    // const { isLoggedIn } = this.props
    return {
      // onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onOpenSignupModal,
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
    if (!this.props.post.isEmpty()) {
      console.log(
        this.props.editorial.get('title'),
        this.props.post.toJS(),
        this.props.postPath,
        this.props.isPostLoved,
      )
    }
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

