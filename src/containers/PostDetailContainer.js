import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectParamsToken, selectParamsUsername } from '../selectors/params'
import { selectPostFromToken } from '../selectors/post'
import { selectStreamType } from '../selectors/stream'
import { loadComments, loadPostDetail, toggleLovers, toggleReposters } from '../actions/posts'
import { ErrorState4xx } from '../components/errors/Errors'
import { Paginator } from '../components/streams/Paginator'
import { PostDetail, PostDetailError } from '../components/views/PostDetail'

export function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  if (!nextProps.author || !nextProps.post) { return false }
  return !Immutable.is(nextProps.post, thisProps.post) ||
    ['isLoggedIn', 'paramsToken', 'paramsUsername'].some(prop =>
      nextProps[prop] !== thisProps[prop],
    ) ||
    ['renderType'].some(prop => nextState[prop] !== thisState[prop])
}

export function mapStateToProps(state, props) {
  const post = selectPostFromToken(state, props)
  return {
    author: state.json.getIn([MAPPING_TYPES.USERS, post.get('authorId')], null),
    isLoggedIn: selectIsLoggedIn(state),
    paramsToken: selectParamsToken(state, props),
    paramsUsername: selectParamsUsername(state, props),
    post,
    streamType: selectStreamType(state),
  }
}

class PostDetailContainer extends Component {

  static propTypes = {
    author: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    post: PropTypes.object,
    paramsToken: PropTypes.string.isRequired,
    paramsUsername: PropTypes.string.isRequired,
  }

  static defaultProps = {
    author: null,
    post: null,
  }

  static preRender = (store, routerState) => {
    const params = routerState.params
    return store.dispatch(loadPostDetail(`~${params.token}`, `~${params.username}`))
  }

  componentWillMount() {
    const { dispatch, paramsToken, paramsUsername, post } = this.props
    if (post) {
      this.lovesWasOpen = post.get('showLovers')
      this.repostsWasOpen = post.get('showReposters')
    }
    this.state = { renderType: POST.DETAIL_REQUEST }
    dispatch(loadPostDetail(`~${paramsToken}`, `~${paramsUsername}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsToken, paramsUsername } = this.props
    if (paramsToken !== nextProps.paramsToken || paramsUsername !== nextProps.paramsUsername) {
      dispatch(loadPostDetail(`~${nextProps.paramsToken}`, `~${nextProps.paramsUsername}`))
    }
    switch (nextProps.streamType) {
      case POST.DETAIL_FAILURE:
      case POST.DETAIL_REQUEST:
      case POST.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
  }

  componentWillUnmount() {
    const { dispatch, isLoggedIn, post } = this.props
    // this prevents the lover/reposters from firing since logout clears the json store
    if (!isLoggedIn) { return }
    if (!this.lovesWasOpen) {
      dispatch(toggleLovers(post, false))
    }
    if (!this.repostsWasOpen) {
      dispatch(toggleReposters(post, false))
    }
  }

  render() {
    const { author, paramsToken, post } = this.props
    const { renderType } = this.state
    if (renderType === POST.DETAIL_REQUEST) {
      return (
        <section className="StreamContainer">
          <Paginator className="isBusy" />
        </section>
      )
    } else if (renderType === POST.DETAIL_FAILURE) {
      return (
        <PostDetailError>
          <ErrorState4xx />
        </PostDetailError>
      )
    }
    if (!post || !post.get('id')) { return null }
    const props = {
      author,
      hasEditor: author && author.get('hasCommentingEnabled') && !(post.get('isReposting') || post.get('isEditing')),
      key: `postDetail_${paramsToken}`,
      post,
      streamAction: author && author.get('hasCommentingEnabled') ? loadComments(post, false) : null,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

