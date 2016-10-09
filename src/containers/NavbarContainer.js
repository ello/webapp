import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { isIOS, scrollTo } from '../lib/jello'
import Session from '../lib/session'
import { ADD_NEW_IDS_TO_RESULT, SET_LAYOUT_MODE } from '../constants/action_types'
import { SESSION_KEYS } from '../constants/application_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectCurrentStream,
  selectDeviceSize,
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsNotificationsActive,
  selectIsNotificationsUnread,
  selectIsProfileMenuActive,
} from '../selectors/gui'
import { selectAvatar, selectUsername } from '../selectors/profile'
import { selectPage } from '../selectors/pages'
import { selectPathname } from '../selectors/routing'
import { logout } from '../actions/authentication'
import { setIsProfileMenuActive, toggleNotifications } from '../actions/gui'
import { checkForNewNotifications } from '../actions/notifications'
import { openOmnibar } from '../actions/omnibar'
import { updateRelationship } from '../actions/relationships'
import { loadFriends, loadNoise } from '../actions/stream'
import { NavbarLoggedIn, NavbarLoggedOut } from '../components/navbar/Navbar'
import { getDiscoverAction } from '../containers/DiscoverContainer'

function mapStateToProps(state, props) {
  const currentStream = selectCurrentStream(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const pathname = selectPathname(state)
  const result = selectPage(state)
  const hasLoadMoreButton = !!(result && result.morePostIds)

  if (isLoggedIn) {
    return {
      avatar: selectAvatar(state),
      deviceSize: selectDeviceSize(state),
      currentStream,
      hasLoadMoreButton,
      isGridMode: selectIsGridMode(state),
      isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
      isLoggedIn,
      isNotificationsActive: selectIsNotificationsActive(state),
      isNotificationsUnread: selectIsNotificationsUnread(state),
      isProfileMenuActive: selectIsProfileMenuActive(state),
      pathname,
      username: selectUsername(state),
    }
  }
  return {
    currentStream,
    hasLoadMoreButton,
    isLoggedIn,
    pathname,
  }
}

class NavbarContainer extends Component {

  static propTypes = {
    currentStream: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isNotificationsActive: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  }

  static contextTypes = {
    onClickScrollToContent: PropTypes.func,
  }

  componentWillMount() {
    this.checkForNotifications()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    if (typeof window === 'undefined' || !prevProps.pathname || !this.props.pathname) { return }
    if (prevProps.pathname !== this.props.pathname) {
      this.checkForNotifications()
    }
  }

  componentWillUnmount() {
    this.deactivateProfileMenu()
  }

  onClickAvatar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { isProfileMenuActive } = this.props
    return isProfileMenuActive ? this.deactivateProfileMenu() : this.activateProfileMenu()
  }

  onClickDocument = () => {
    this.deactivateProfileMenu()
  }

  onClickNotification = (e) => {
    if (e) { e.preventDefault() }
    const { dispatch, isNotificationsActive } = this.props
    dispatch(toggleNotifications({ isActive: !isNotificationsActive }))
  }

  onClickLoadMorePosts = () => {
    const { dispatch, params } = this.props
    dispatch({ type: ADD_NEW_IDS_TO_RESULT })
    // if on user page and more content scroll to top of content
    if (params.username && !params.token) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    } else {
      scrollTo(0, 0)
    }
  }

  onClickNavbarMark = () => {
    const { currentStream, dispatch, pathname, params } = this.props
    if (currentStream === pathname) {
      if (/^\/discover/.test(pathname)) {
        if (params.type) {
          dispatch(getDiscoverAction(params.type))
        }
      } else if (/^\/following$/.test(pathname)) {
        dispatch(loadFriends())
      } else if (/^\/starred/.test(pathname)) {
        dispatch(loadNoise())
      }
      scrollTo(0, 0)
    }
  }

  onClickOmniButton = () => {
    const { dispatch } = this.props
    dispatch(openOmnibar())
    scrollTo(0, 0)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onDragOverOmniButton = (e) => {
    e.preventDefault()
    this.onClickOmniButton()
  }

  onDragOverStreamLink = (e) => {
    e.preventDefault()
    e.target.classList.add('hasDragOver')
  }

  onDragLeaveStreamLink = (e) => {
    e.target.classList.remove('hasDragOver')
  }

  onDropStreamLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('hasDragOver')
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.userId && data.priority) {
        const newPriority = e.target.getAttribute('href') === '/starred' ? 'noise' : 'friend'
        this.props.dispatch(updateRelationship(data.userId, newPriority, data.priority))
      }
    }
  }

  onLogOut = () => {
    const { dispatch } = this.props
    this.deactivateProfileMenu()
    dispatch(logout())
  }

  // if we're viewing notifications, don't change the lightning-bolt link.
  // on any other page, we have the notifications link go back to whatever
  // category you were viewing last.
  getNotificationCategory() {
    const { pathname } = this.props
    if (pathname.match(/^\/notifications\b/)) { return '' }
    return (
      Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER) ?
        `/${Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER)}` : ''
    )
  }

  checkForNotifications() {
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) { dispatch(checkForNewNotifications()) }
  }

  activateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: true }))
    document.addEventListener('click', this.onClickDocument)
    if (isIOS()) {
      document.addEventListener('touchstart', this.onClickDocument)
    }
  }

  deactivateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (!isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: false }))
    document.removeEventListener('click', this.onClickDocument)
    if (isIOS()) {
      document.removeEventListener('touchstart', this.onClickDocument)
    }
  }

  render() {
    const { isLoggedIn } = this.props
    if (isLoggedIn) {
      return (
        <NavbarLoggedIn
          {...this.props}
          notificationCategory={this.getNotificationCategory()}
          onClickAvatar={this.onClickAvatar}
          onClickDocument={this.onClickDocument}
          onClickLoadMorePosts={this.onClickLoadMorePosts}
          onClickNavbarMark={this.onClickNavbarMark}
          onClickNotification={this.onClickNotification}
          onClickOmniButton={this.onClickOmniButton}
          onClickToggleLayoutMode={this.onClickToggleLayoutMode}
          onDragLeaveStreamLink={this.onDragLeaveStreamLink}
          onDragOverOmniButton={this.onDragOverOmniButton}
          onDragOverStreamLink={this.onDragOverStreamLink}
          onDropStreamLink={this.onDropStreamLink}
          onLogOut={this.onLogOut}
        />
      )
    }
    return (
      <NavbarLoggedOut
        {...this.props}
        onClickLoadMorePosts={this.onClickLoadMorePosts}
        onClickNavbarMark={this.onClickNavbarMark}
      />
    )
  }
}

export default connect(mapStateToProps)(NavbarContainer)

