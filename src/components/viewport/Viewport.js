import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const Viewport = (props) =>
  <div
    className={classNames(
      'Viewport',
      { isAuthenticationView: props.isAuthenticationView },
      { isNavbarFixed: props.isNavbarFixed },
      { isNavbarHidden: props.isNavbarHidden },
      { isNavbarSkippingTransition: props.isNavbarSkippingTransition },
      { isNotificationsActive: props.isNotificationsActive },
      { isOnboardingView: props.isOnboardingView },
      { isProfileMenuActive: props.isProfileMenuActive },
    )}
    role="presentation"
  />

Viewport.propTypes = {
  isAuthenticationView: PropTypes.bool.isRequired,
  isNavbarFixed: PropTypes.bool.isRequired,
  isNavbarHidden: PropTypes.bool.isRequired,
  isNavbarSkippingTransition: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isOnboardingView: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
}

export default Viewport

