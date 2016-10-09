import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { createSelector } from 'reselect'
import {
  selectInnerHeight,
  selectInnerWidth,
  selectIsNavbarHidden,
  selectIsNotificationsActive,
  selectIsProfileMenuActive,
  selectScrollOffset,
} from '../selectors/gui'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { setIsNavbarHidden, setViewportSizeAttributes } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'

const selectIsAuthenticationView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication' || viewName === 'join'
)

const selectIsOnboardingView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'onboarding'
)

export const selectUserDetailPathClassName = createSelector(
  [selectViewNameFromRoute, selectPathname], (viewName, pathname) => {
    if (viewName !== 'userDetail') { return null }
    if (/\/following\b/.test(pathname)) { return 'isUserDetailFollowing' }
    if (/\/followers\b/.test(pathname)) { return 'isUserDetailFollowers' }
    if (/\/loves\b/.test(pathname)) { return 'isUserDetailLoves' }
    return 'isUserDetailPosts'
  }
)

function mapStateToProps(state, props) {
  return {
    innerHeight: selectInnerHeight(state),
    innerWidth: selectInnerWidth(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isNotificationsActive: selectIsNotificationsActive(state),
    isOnboardingView: selectIsOnboardingView(state),
    isProfileMenuActive: selectIsProfileMenuActive(state),
    pathname: selectPathname(state),
    scrollOffset: selectScrollOffset(state),
    userDetailPathClassName: selectUserDetailPathClassName(state, props),
  }
}

class ViewportContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isAuthenticationView: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isNotificationsActive: PropTypes.bool,
    isOnboardingView: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    scrollOffset: PropTypes.number,
    userDetailPathClassName: PropTypes.string,
  }

  componentWillMount() {
    this.hasResized = false
  }

  componentDidMount() {
    addResizeObject(this)
    addScrollObject(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pathname === this.props.pathname) { return }
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
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
      return
    }
  }

  render() {
    const props = {
      isAuthenticationView: this.props.isAuthenticationView,
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

