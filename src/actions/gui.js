import { GUI } from '../constants/action_types'

export function setActiveUserFollowingType(type) {
  return {
    type: GUI.SET_ACTIVE_USER_FOLLOWING_TYPE,
    payload: { tab: type },
  }
}

export function setIsNavbarHidden({ isHidden }) {
  return {
    type: GUI.SET_IS_NAVBAR_HIDDEN,
    payload: {
      isNavbarHidden: isHidden,
    },
  }
}

export function setIsProfileMenuActive({ isActive }) {
  return {
    type: GUI.SET_IS_PROFILE_MENU_ACTIVE,
    payload: {
      isProfileMenuActive: isActive,
    },
  }
}

export function setLastDiscoverBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_DISCOVER_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setLastFollowingBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_FOLLOWING_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setLastStarredBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_STARRED_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setScrollScreen({ scrollScreen }) {
  return {
    type: GUI.SET_SCROLL_SCREEN,
    payload: {
      scrollScreen,
    },
  }
}

export function setViewportSizeAttributes(resizeAttributes) {
  return {
    type: GUI.SET_VIEWPORT_SIZE_ATTRIBUTES,
    payload: {
      ...resizeAttributes,
    },
  }
}

export function setSignupModalLaunched(launched = true) {
  return {
    type: GUI.SET_SIGNUP_MODAL_LAUNCHED,
    payload: {
      hasLaunchedSignupModal: launched,
    },
  }
}

export function toggleNotifications({ isActive }) {
  return {
    type: GUI.TOGGLE_NOTIFICATIONS,
    payload: {
      isNotificationsActive: isActive,
    },
  }
}

