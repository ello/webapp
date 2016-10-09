import { REHYDRATE } from 'redux-persist/constants'
import get from 'lodash/get'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  EDITOR,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  OMNIBAR,
  PROFILE,
  SET_LAYOUT_MODE,
  ZEROS,
} from '../constants/action_types'

let location = {}
const oldDate = new Date()
oldDate.setFullYear(oldDate.getFullYear() - 2)

const ONBOARDING_WHITELIST = [
  /^\/onboarding\b/,
]

const STREAMS_WHITELIST = [
  /^\/discover/,
  /^\/following$/,
  /^\/starred$/,
]

export const findLayoutMode = (modes) => {
  for (const mode of modes) {
    const regex = new RegExp(mode.regex)
    if (regex.test(location.pathname)) {
      return mode
    }
  }
  return null
}

const getIsGridMode = (modes) => {
  const mode = findLayoutMode(modes)
  if (!mode) { return null }
  return mode.mode === 'grid'
}

const initialNonPersistedState = {
  isCompleterActive: false,
  isNotificationsActive: false,
  isOmnibarActive: false,
  isProfileMenuActive: false,
  isTextToolsActive: false,
  saidHelloTo: [],
  textToolsCoordinates: { top: -200, left: -666 },
  textToolsStates: {},
}

export const initialState = {
  ...initialNonPersistedState,
  activeNotificationsType: 'all',
  activeUserFollowingType: 'friend',
  columnCount: 2,
  currentStream: '/discover',
  discoverKeyType: null,
  innerHeight: 0,
  innerWidth: 0,
  isGridMode: true,
  isNavbarHidden: false,
  isNotificationsUnread: false,
  isOnboardingView: false,
  lastDiscoverBeaconVersion: '0',
  lastFollowingBeaconVersion: '0',
  lastNotificationCheck: oldDate.toUTCString(),
  lastStarredBeaconVersion: '0',
  // order matters for matching routes
  modes: [
    { label: 'root', mode: 'grid', regex: '^/$' },
    { label: 'discover', mode: 'grid', regex: '/discover|/explore' },
    { label: 'following', mode: 'grid', regex: '/following' },
    { label: 'invitations', mode: 'list', regex: '/invitations' },
    { label: 'onboarding', mode: 'grid', regex: '/onboarding' },
    { label: 'notifications', mode: 'list', regex: '/notifications' },
    { label: 'search', mode: 'grid', regex: '/search|/find' },
    { label: 'settings', mode: 'list', regex: '/settings' },
    { label: 'starred', mode: 'list', regex: '/starred' },
    { label: 'staff', mode: 'list', regex: '/staff' },
    { label: 'posts', mode: 'list', regex: '/[\\w\\-]+/post/.+' },
    { label: 'users/following', mode: 'grid', regex: '/[\\w\\-]+/following' },
    { label: 'users/followers', mode: 'grid', regex: '/[\\w\\-]+/followers' },
    { label: 'users/loves', mode: 'grid', regex: '/[\\w\\-]+/loves' },
    { label: 'users', mode: 'grid', regex: '/[\\w\\-]+' },
  ],
}

export const gui = (state = initialState, action = { type: '' }) => {
  const newState = { ...state }
  let mode = null
  let pathname = null
  let isOnboardingView = null
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
      return { ...state, discoverKeyType: null }
    case EDITOR.SET_IS_COMPLETER_ACTIVE:
      return { ...state, isCompleterActive: action.payload.isCompleterActive }
    case EDITOR.SET_IS_TEXT_TOOLS_ACTIVE:
      return {
        ...state,
        isTextToolsActive: action.payload.isTextToolsActive,
        textToolsStates: action.payload.textToolsStates,
      }
    case EDITOR.SET_TEXT_TOOLS_COORDINATES:
      return { ...state, textToolsCoordinates: action.payload.textToolsCoordinates }
    case GUI.BIND_DISCOVER_KEY:
      return { ...state, discoverKeyType: action.payload.type }
    case GUI.NOTIFICATIONS_TAB:
      return { ...state, activeNotificationsType: action.payload.activeTabType }
    case GUI.SET_ACTIVE_USER_FOLLOWING_TYPE:
      return { ...state, activeUserFollowingType: action.payload.tab }
    case GUI.SET_IS_NAVBAR_HIDDEN:
      return {
        ...state,
        isNavbarHidden: get(action.payload, 'isNavbarHidden', state.isNavbarHidden),
      }
    case GUI.SET_IS_PROFILE_MENU_ACTIVE:
      return { ...state, isProfileMenuActive: action.payload.isProfileMenuActive }
    case GUI.SET_LAST_DISCOVER_BEACON_VERSION:
      return { ...state, lastDiscoverBeaconVersion: action.payload.version }
    case GUI.SET_LAST_FOLLOWING_BEACON_VERSION:
      return { ...state, lastFollowingBeaconVersion: action.payload.version }
    case GUI.SET_LAST_STARRED_BEACON_VERSION:
      return { ...state, lastStarredBeaconVersion: action.payload.version }
    case GUI.SET_VIEWPORT_SIZE_ATTRIBUTES:
      return { ...state, ...action.payload }
    case GUI.TOGGLE_NOTIFICATIONS:
      return { ...state, isNotificationsActive: action.payload.isNotificationsActive }
    case HEAD_FAILURE:
      return { ...state, isNotificationsUnread: false }
    case HEAD_SUCCESS:
      if (action.payload.serverStatus === 304) {
        return { ...state, isNotificationsUnread: false }
      } else if (action.payload.serverStatus === 204) {
        return { ...state, isNotificationsUnread: true }
      }
      return state
    case LOAD_STREAM_SUCCESS:
      if (action.meta && /\/notifications/.test(action.meta.resultKey)) {
        return {
          ...state,
          isNotificationsUnread: false,
          lastNotificationCheck: new Date().toUTCString(),
        }
      }
      return state
    case LOCATION_CHANGE: {
      location = action.payload
      pathname = location.pathname
      isOnboardingView = ONBOARDING_WHITELIST.some(pagex => pagex.test(pathname))
      if (STREAMS_WHITELIST.some(re => re.test(pathname))) {
        return {
          ...state,
          currentStream: pathname,
          isGridMode: getIsGridMode(state.modes),
          isNavbarHidden: false,
          isOnboardingView,
        }
      }
      return {
        ...state,
        isGridMode: getIsGridMode(state.modes),
        isNavbarHidden: false,
        isOnboardingView,
      }
    }
    case OMNIBAR.OPEN:
    case OMNIBAR.CLOSE:
      return { ...state, isOmnibarActive: action.payload.isActive }
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case REHYDRATE:
      if (action.payload.gui) {
        return {
          ...state,
          ...action.payload.gui,
          ...initialNonPersistedState,
          isNavbarHidden: false,
          isOnboardingView: state.isOnboardingView,
        }
      }
      return {
        ...state,
        ...initialNonPersistedState,
        isNavbarHidden: false,
      }
    case SET_LAYOUT_MODE:
      mode = findLayoutMode(newState.modes)
      if (!mode) { return state }
      mode.mode = action.payload.mode
      return { ...state, isGridMode: action.payload.mode === 'grid' }
    case ZEROS.SAY_HELLO:
      return { ...state, saidHelloTo: [...state.saidHelloTo, action.payload.username] }
    default:
      return state
  }
}

// this is used for testing in StreamContainer_test
export const setLocation = (loc) => {
  location = loc
}

