import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import shallowCompare from 'react-addons-shallow-compare'
import { USER } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectActiveUserFollowingType, selectHasSaidHelloTo } from '../selectors/gui'
import { selectParamsType, selectParamsUsername } from '../selectors/params'
import { selectStreamType } from '../selectors/stream'
import { selectUserFromUsername } from '../selectors/user'
import { setActiveUserFollowingType } from '../actions/gui'
import { sayHello } from '../actions/zeros'
import {
  loadUserDetail, loadUserLoves, loadUserPosts, loadUserUsers, loadUserFollowing,
} from '../actions/user'
import { ErrorState4xx } from '../components/errors/Errors'
import { UserDetail, UserDetailError } from '../components/views/UserDetail'


const followingTabs = [
  { type: 'friend', children: 'Following' },
  { type: 'noise', children: 'Starred' },
]

export function getStreamAction({ activeUserFollowingType = 'friend', type = 'posts', username }) {
  switch (type) {
    case 'following':
      return loadUserFollowing(`~${username}`, activeUserFollowingType)
    case 'followers':
      return loadUserUsers(`~${username}`, type)
    case 'loves':
      return loadUserLoves(`~${username}`, type)
    case 'posts':
    default:
      return loadUserPosts(`~${username}`, type)
  }
}

const selectUserDetailStreamAction = createSelector(
  [selectActiveUserFollowingType, selectParamsType, selectParamsUsername],
  (activeUserFollowingType, type, username) =>
    getStreamAction({ activeUserFollowingType, type, username })
)

export function mapStateToProps(state, props) {
  const type = selectParamsType(state, props) || 'posts'
  const username = selectParamsUsername(state, props)
  const user = selectUserFromUsername(state, props)
  const activeUserFollowingType = selectActiveUserFollowingType(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const isPostHeaderHidden = type !== 'loves'
  const isSelf = isLoggedIn && user ? user.relationshipPriority === 'self' : false
  const hasSaidHelloTo = user ? !isSelf && selectHasSaidHelloTo(state, props) : false
  const keyPostfix = isSelf && activeUserFollowingType ? `/${activeUserFollowingType}` : ''
  const streamAction = selectUserDetailStreamAction(state, props)

  return {
    activeUserFollowingType,
    isLoggedIn,
    isPostHeaderHidden,
    isSelf,
    hasZeroFollowers: user ? user.followersCount < 1 : false,
    hasZeroPosts: user ? user.postsCount < 1 : false,
    hasSaidHelloTo,
    paramsType: type,
    paramsUsername: username,
    streamAction,
    streamType: selectStreamType(state),
    tabs: isSelf && type === 'following' ? followingTabs : null,
    user,
    viewKey: `userDetail/${username}/${type}${keyPostfix}`,
  }
}

class UserDetailContainer extends Component {
  static propTypes = {
    activeUserFollowingType: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool,
    isSelf: PropTypes.bool.isRequired,
    hasSaidHelloTo: PropTypes.bool.isRequired,
    hasZeroFollowers: PropTypes.bool.isRequired,
    hasZeroPosts: PropTypes.bool.isRequired,
    paramsType: PropTypes.string,
    paramsUsername: PropTypes.string.isRequired,
    streamAction: PropTypes.object,
    streamType: PropTypes.string,
    tabs: PropTypes.array,
    user: PropTypes.object,
    viewKey: PropTypes.string,
  }

  static preRender = (store, routerState) => {
    const { type = 'posts', username } = routerState.params
    const profileAction = loadUserDetail(`~${username}`)
    const streamAction = getStreamAction({ type, username })
    return Promise.all([
      store.dispatch(profileAction),
      store.dispatch(streamAction),
    ])
  }

  componentWillMount() {
    const { dispatch, paramsUsername } = this.props
    dispatch(loadUserDetail(`~${paramsUsername}`))
    this.state = { isStreamFailing: false }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsUsername } = this.props
    if (paramsUsername !== nextProps.paramsUsername) {
      dispatch(loadUserDetail(`~${nextProps.paramsUsername}`))
    }
    if (nextProps.streamType === USER.DETAIL_SUCCESS) {
      this.setState({ isStreamFailing: false })
    } else if (nextProps.streamType === USER.DETAIL_FAILURE) {
      this.setState({ isStreamFailing: true })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isStreamFailing !== nextState.isStreamFailing) {
      return true
    } else if (!nextProps.user) {
      return false
    }
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const { activeUserFollowingType, dispatch, streamAction, tabs, user, viewKey } = this.props
    const { isLoggedIn, isPostHeaderHidden, isSelf } = this.props
    const { hasSaidHelloTo, hasZeroFollowers, hasZeroPosts } = this.props
    const { isStreamFailing } = this.state
    const shouldBindHello = hasZeroPosts && !hasSaidHelloTo

    if (isStreamFailing) {
      return (
        <UserDetailError>
          <ErrorState4xx />
        </UserDetailError>
      )
    }
    if (!user) { return null }
    const props = {
      activeType: activeUserFollowingType,
      isLoggedIn,
      isPostHeaderHidden,
      isSelf,
      hasSaidHelloTo,
      hasZeroFollowers,
      hasZeroPosts,
      onSubmitHello: shouldBindHello ? bindActionCreators(sayHello, dispatch) : null,
      onTabClick: isSelf && tabs ? bindActionCreators(setActiveUserFollowingType, dispatch) : null,
      streamAction,
      tabs,
      user,
    }
    return <UserDetail {...props} key={viewKey} />
  }
}

export default connect(mapStateToProps)(UserDetailContainer)

