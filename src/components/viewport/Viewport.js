// @flow
import React from 'react'
import classNames from 'classnames'

type Props = {
  isAuthenticationView: boolean,
  isDiscoverView: boolean,
  isNavbarHidden: boolean,
  isNotificationsActive: boolean,
  isOnboardingView: boolean,
  isProfileMenuActive: boolean,
  userDetailPathClassName: string|null,
}

export const Viewport = (props: Props) =>
  <div
    className={classNames(
      'Viewport',
      { isAuthenticationView: props.isAuthenticationView },
      { isDiscoverView: props.isDiscoverView },
      { isNavbarHidden: props.isNavbarHidden },
      { isNotificationsActive: props.isNotificationsActive },
      { isOnboardingView: props.isOnboardingView },
      { isProfileMenuActive: props.isProfileMenuActive },
      props.userDetailPathClassName,
    )}
    role="presentation"
  />

export default Viewport

