import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
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
    getStreamAction({ activeUserFollowingType, type, username }),
)

export function mapStateToProps(state, props) {
  const type = selectParamsType(state, props) || 'posts'
  const username = selectParamsUsername(state, props)
  const user = selectUserFromUsername(state, props)
  const activeUserFollowingType = selectActiveUserFollowingType(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const isPostHeaderHidden = type !== 'loves'
  const isSelf = isLoggedIn && user.get('relationshipPriority') === 'self'
  const hasSaidHelloTo = user ? !isSelf && selectHasSaidHelloTo(state, props) : false
  const keyPostfix = isSelf && activeUserFollowingType ? `/${activeUserFollowingType}` : ''
  const streamAction = selectUserDetailStreamAction(state, props)

  return {
    activeUserFollowingType,
    isLoggedIn,
    isPostHeaderHidden,
    isSelf,
    hasZeroFollowers: Number(user.get('followersCount')) < 1 || false,
    hasZeroPosts: Number(user.get('postsCount')) < 1 || false,
    hasSaidHelloTo,
    paramsUsername: username,
    streamAction,
    streamType: selectStreamType(state),
    tabs: isSelf && type === 'following' ? followingTabs : [],
    user,
    viewKey: `userDetail/${username}/${type}${keyPostfix}`,
  }
}

class UserDetailContainer extends Component {
  static propTypes = {
    activeUserFollowingType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    hasSaidHelloTo: PropTypes.bool.isRequired,
    hasZeroFollowers: PropTypes.bool.isRequired,
    hasZeroPosts: PropTypes.bool.isRequired,
    paramsUsername: PropTypes.string.isRequired,
    streamAction: PropTypes.object.isRequired,
    tabs: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    viewKey: PropTypes.string.isRequired,
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
    this.state = { renderType: USER.DETAIL_REQUEST }
    dispatch(loadUserDetail(`~${paramsUsername}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsUsername } = this.props
    if (paramsUsername !== nextProps.paramsUsername) {
      dispatch(loadUserDetail(`~${nextProps.paramsUsername}`))
    }
    switch (nextProps.streamType) {
      case USER.DETAIL_FAILURE:
      case USER.DETAIL_REQUEST:
      case USER.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.user) { return false }
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const { activeUserFollowingType, dispatch, streamAction, tabs, user, viewKey } = this.props
    const { isLoggedIn, isPostHeaderHidden, isSelf } = this.props
    const { hasSaidHelloTo, hasZeroFollowers, hasZeroPosts } = this.props
    const { renderType } = this.state
    const shouldBindHello = hasZeroPosts && !hasSaidHelloTo

    if (renderType === USER.DETAIL_FAILURE) {
      return (
        <UserDetailError>
          <ErrorState4xx />
        </UserDetailError>
      )
    }
    if (!user || !user.get('id')) { return null }
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

