import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import {
  selectInnerHeight,
  selectInnerWidth,
  selectIsAuthenticationView,
  selectIsNavbarHidden,
  selectIsNotificationsActive,
  selectIsOnboardingView,
  selectIsProfileMenuActive,
  selectScrollOffset,
} from '../selectors/gui'
import { selectPathname } from '../selectors/routing'
import { setIsNavbarHidden, setViewportSizeAttributes } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'

function mapStateToProps(state) {
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
  }
}

/* eslint-disable react/no-unused-prop-types */
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
    return <Viewport {...this.props} />
  }
}
/* eslint-enable react/no-unused-prop-types */

export default connect(mapStateToProps)(ViewportContainer)

