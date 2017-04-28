import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { scrollToPosition } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import { ADD_NEW_IDS_TO_RESULT, SET_LAYOUT_MODE } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectCategoryTabs } from '../selectors/categories'
import {
  selectActiveNotificationsType,
  selectDeviceSize,
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsNotificationsActive,
  selectIsNotificationsUnread,
  selectIsProfileMenuActive,
} from '../selectors/gui'
import { selectAnnouncementHasBeenViewed } from '../selectors/notifications'
import { selectAvatar, selectUsername } from '../selectors/profile'
import { selectPage } from '../selectors/pages'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { trackEvent } from '../actions/analytics'
import { logout } from '../actions/authentication'
import { setIsProfileMenuActive, toggleNotifications } from '../actions/gui'
import { checkForNewNotifications, loadAnnouncements } from '../actions/notifications'
import { openOmnibar } from '../actions/omnibar'
import { updateRelationship } from '../actions/relationships'
import { NavbarLoggedIn, NavbarLoggedOut } from '../components/navbar/NavbarRenderables'

function mapStateToProps(state, props) {
  const isLoggedIn = selectIsLoggedIn(state)
  const pathname = selectPathname(state)
  const pageResult = selectPage(state)
  const hasLoadMoreButton = !!(pageResult && pageResult.get('morePostIds'))
  const viewName = selectViewNameFromRoute(state)
  const categoryTabs = viewName === 'discover' ? selectCategoryTabs(state) : null
  const isUnread = selectIsNotificationsUnread(state) || !selectAnnouncementHasBeenViewed(state)
  const isGridMode = selectIsGridMode(state)

  if (isLoggedIn) {
    return {
      activeTabType: selectActiveNotificationsType(state),
      avatar: selectAvatar(state),
      categoryTabs,
      deviceSize: selectDeviceSize(state),
      hasLoadMoreButton,
      isGridMode,
      isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
      isLoggedIn,
      isNotificationsActive: selectIsNotificationsActive(state),
      isNotificationsUnread: isUnread,
      isProfileMenuActive: selectIsProfileMenuActive(state),
      pathname,
      username: selectUsername(state),
      viewName,
    }
  }
  return {
    categoryTabs,
    hasLoadMoreButton,
    isGridMode,
    isLoggedIn,
    pathname,
    viewName,
  }
}

class NavbarContainer extends PureComponent {

  static propTypes = {
    activeTabType: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isProfileMenuActive: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNotificationsActive: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    viewName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    activeTabType: '',
    isProfileMenuActive: false,
    isNotificationsActive: false,
  }

  static contextTypes = {
    onClickScrollToContent: PropTypes.func.isRequired,
    onLaunchNativeEditor: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.checkForNotifications(true)
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
    const { dispatch, params, pathname } = this.props
    dispatch({ type: ADD_NEW_IDS_TO_RESULT, payload: { resultKey: pathname } })
    // if on user page and more content scroll to top of content
    if (params.username && !params.token) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    } else {
      scrollToPosition(0, 0)
    }
  }

  onClickNavbarMark = () => {
    const { dispatch } = this.props
    dispatch(push('/'))
    scrollToPosition(0, 0)
  }

  onClickOmniButton = () => {
    const { dispatch } = this.props
    if (ElloAndroidInterface.supportsNativeEditor()) {
      dispatch(trackEvent('opened_omnibar'))
      this.context.onLaunchNativeEditor(null, false, null)
    } else {
      dispatch(openOmnibar())
      scrollToPosition(0, 0)
    }
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
      if (data.userId && data.priority && e.target.getAttribute('href') === '/following') {
        this.props.dispatch(updateRelationship(data.userId, 'friend', data.priority))
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
    const { activeTabType, viewName } = this.props
    return viewName === 'notifications' ? '' : `/${activeTabType}`
  }

  checkForNotifications(isMounting = false) {
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      dispatch(checkForNewNotifications())
      if (!isMounting) { dispatch(loadAnnouncements()) }
    }
  }

  activateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: true }))
    document.addEventListener('click', this.onClickDocument)
  }

  deactivateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (!isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: false }))
    document.removeEventListener('click', this.onClickDocument)
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

