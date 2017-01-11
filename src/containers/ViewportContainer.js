import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectHasLaunchedSignupModal,
  selectInnerHeight,
  selectInnerWidth,
  selectIsNavbarHidden,
  selectIsNotificationsActive,
  selectIsProfileMenuActive,
  selectScrollOffset,
} from '../selectors/gui'
import { selectModalType } from '../selectors/modal'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { setIsNavbarHidden, setViewportSizeAttributes } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import {
  addPageVisibilityObserver,
  removePageVisibilityObserver,
} from '../components/viewport/PageVisibilityComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'

const REFRESH_PERIOD = 30 * 60 * 1000 // 30 minutes in microseconds
const selectIsAuthenticationView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication' || viewName === 'join',
)

const selectIsOnboardingView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'onboarding',
)

export const selectUserDetailPathClassName = createSelector(
  [selectViewNameFromRoute, selectPathname], (viewName, pathname) => {
    if (viewName !== 'userDetail') { return null }
    if (/\/following\b/.test(pathname)) { return 'isUserDetailFollowing' }
    if (/\/followers\b/.test(pathname)) { return 'isUserDetailFollowers' }
    if (/\/loves\b/.test(pathname)) { return 'isUserDetailLoves' }
    return 'isUserDetailPosts'
  },
)

function mapStateToProps(state, props) {
  return {
    hasLaunchedSignupModal: selectHasLaunchedSignupModal(state),
    innerHeight: selectInnerHeight(state),
    innerWidth: selectInnerWidth(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isDiscoverView: selectViewNameFromRoute(state) === 'discover',
    isLoggedIn: selectIsLoggedIn(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isNotificationsActive: selectIsNotificationsActive(state),
    isOnboardingView: selectIsOnboardingView(state),
    isProfileMenuActive: selectIsProfileMenuActive(state),
    modalType: selectModalType(state),
    scrollOffset: selectScrollOffset(state),
    userDetailPathClassName: selectUserDetailPathClassName(state, props),
  }
}

class ViewportContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasLaunchedSignupModal: PropTypes.bool,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isAuthenticationView: PropTypes.bool,
    isDiscoverView: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isNotificationsActive: PropTypes.bool,
    isOnboardingView: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    modalType: PropTypes.string,
    scrollOffset: PropTypes.number,
    userDetailPathClassName: PropTypes.string,
  }

  static defaultProps = {
    hasLaunchedSignupModal: false,
    innerHeight: 0,
    innerWidth: 0,
    isAuthenticationView: false,
    isDiscoverView: false,
    isLoggedIn: false,
    isNavbarHidden: false,
    isNotificationsActive: false,
    isOnboardingView: false,
    isProfileMenuActive: false,
    modalType: null,
    scrollOffset: 0,
    userDetailPathClassName: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    this.hasResized = false
  }

  componentDidMount() {
    addPageVisibilityObserver(this)
    addResizeObject(this)
    addScrollObject(this)
  }

  componentWillUnmount() {
    removePageVisibilityObserver(this)
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onPageVisibilityHidden() {
    const { isLoggedIn } = this.props
    if (isLoggedIn && ENV.ENABLE_REFRESH_ON_FOCUS) {
      this.hiddenAt = new Date()
    }
  }

  onPageVisibilityVisible() {
    const { hasLaunchedSignupModal, isLoggedIn, modalType } = this.props
    if (!isLoggedIn && !hasLaunchedSignupModal && !modalType) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('page-visibility')
    } else if (isLoggedIn) {
      const drift = new Date() - this.hiddenAt
      if (this.hiddenAt && drift >= REFRESH_PERIOD) {
        window.location.reload(true)
      }
    }
  }

  onResize(resizeAttributes) {
    const { innerHeight: prevHeight, innerWidth: prevWidth } = this.props
    const { innerHeight: nextHeight, innerWidth: nextWidth } = resizeAttributes
    if (!this.hasResized || (prevHeight !== nextHeight || prevWidth !== nextWidth)) {
      this.hasResized = true
      this.props.dispatch(setViewportSizeAttributes(resizeAttributes))
    }
  }

  onScrollTop() {
    const { dispatch, isNavbarHidden } = this.props
    if (isNavbarHidden) {
      dispatch(setIsNavbarHidden({ isHidden: false }))
    }
  }

  onScroll({ scrollDirection, scrollY }) {
    const { dispatch, isNavbarHidden, scrollOffset } = this.props

    // Scroll positions less than the height of the viewport, show the navbar
    if (scrollY < scrollOffset) {
      if (isNavbarHidden) {
        dispatch(setIsNavbarHidden({ isHidden: false }))
      }
      return
    }
    if (!isNavbarHidden && scrollDirection === 'down') {
      dispatch(setIsNavbarHidden({ isHidden: true }))
      return
    }
    if (isNavbarHidden && scrollDirection === 'up') {
      dispatch(setIsNavbarHidden({ isHidden: false }))
    }
  }

  render() {
    const props = {
      isAuthenticationView: this.props.isAuthenticationView,
      isDiscoverView: this.props.isDiscoverView,
      isNavbarHidden: this.props.isNavbarHidden,
      isNotificationsActive: this.props.isNotificationsActive,
      isOnboardingView: this.props.isOnboardingView,
      isProfileMenuActive: this.props.isProfileMenuActive,
      userDetailPathClassName: this.props.userDetailPathClassName,
    }
    return <Viewport {...props} />
  }
}

export default connect(mapStateToProps)(ViewportContainer)

