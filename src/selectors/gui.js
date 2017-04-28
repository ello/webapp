import { createSelector } from 'reselect'
import { selectParamsUsername } from './params'
import { selectPathname, selectPropsQueryType } from './routing'

// state.gui.xxx
export const selectActiveNotificationsType = state => state.gui.get('activeNotificationsType')
export const selectColumnCount = state => state.gui.get('columnCount')
export const selectDiscoverKeyType = state => state.gui.get('discoverKeyType')
export const selectHasLaunchedSignupModal = state => state.gui.get('hasLaunchedSignupModal')
export const selectInnerHeight = state => state.gui.get('innerHeight')
export const selectInnerWidth = state => state.gui.get('innerWidth')
export const selectIsCompleterActive = state => state.gui.get('isCompleterActive')
export const selectIsGridMode = state => state.gui.get('isGridMode')
export const selectIsNavbarHidden = state => state.gui.get('isNavbarHidden')
export const selectIsNotificationsActive = state => state.gui.get('isNotificationsActive')
export const selectIsNotificationsUnread = state => state.gui.get('isNotificationsUnread')
export const selectIsProfileMenuActive = state => state.gui.get('isProfileMenuActive')
export const selectIsTextToolsActive = state => state.gui.get('isTextToolsActive')
export const selectLastAnnouncementSeen = state => state.gui.get('lastAnnouncementSeen')
export const selectLastDiscoverBeaconVersion = state => state.gui.get('lastDiscoverBeaconVersion') // eslint-disable-line
export const selectLastFollowingBeaconVersion = state => state.gui.get('lastFollowingBeaconVersion') // eslint-disable-line
export const selectLastNotificationCheck = state => state.gui.get('lastNotificationCheck')
export const selectNotificationScrollPositions = state => state.gui.get('notificationScrollPositions')
export const selectSaidHelloTo = state => state.gui.get('saidHelloTo')
export const selectTextToolsCoordinates = state => state.gui.get('textToolsCoordinates')
export const selectTextToolsStates = state => state.gui.get('textToolsStates')

// Memoized selectors
export const selectActiveNotificationScrollPosition = createSelector(
  [selectActiveNotificationsType, selectNotificationScrollPositions], (type, positions) =>
    positions.get(type, 0),
)

export const selectDeviceSize = createSelector(
  [selectColumnCount, selectInnerWidth], (columnCount, innerWidth) => {
    // deviceSize could be anything: baby, momma, poppa bear would work too.
    if (columnCount >= 4) {
      return 'desktop'
    } else if (columnCount >= 2 && innerWidth >= 640) {
      return 'tablet'
    }
    return 'mobile'
  },
)

export const selectIsMobile = createSelector(
  [selectDeviceSize], deviceSize =>
    deviceSize === 'mobile',
)

export const selectIsMobileGridStream = createSelector(
  [selectDeviceSize, selectIsGridMode], (deviceSize, isGridMode) =>
    deviceSize === 'mobile' && isGridMode,
)

export const selectPaddingOffset = createSelector(
  [selectDeviceSize, selectColumnCount], (deviceSize, columnCount) => {
    if (deviceSize === 'mobile') { return 10 }
    return columnCount >= 4 ? 40 : 20
  },
)

export const selectCommentOffset = createSelector(
  [selectDeviceSize], deviceSize =>
    (deviceSize === 'mobile' ? 40 : 60),
)

export const selectColumnWidth = createSelector(
  [selectColumnCount, selectInnerWidth, selectPaddingOffset], (columnCount, innerWidth, padding) =>
    Math.round((innerWidth - ((columnCount + 1) * padding)) / columnCount),
)

export const selectContentWidth = createSelector(
  [selectInnerWidth, selectPaddingOffset], (innerWidth, padding) =>
    Math.round(innerWidth - (padding * 2)),
)

// This is very rudimentary. needs things like 1x, 2x calculating the set
// Primarily used for background images in Heros
export const selectDPI = createSelector(
  [selectInnerWidth], (innerWidth) => {
    if (innerWidth < 750) {
      return 'hdpi'
    } else if (innerWidth >= 750 && innerWidth < 1920) {
      return 'xhdpi'
    }
    return 'optimized'
  },
)

export const selectHasSaidHelloTo = createSelector(
  [selectSaidHelloTo, selectParamsUsername], (saidHelloTo, username) =>
    saidHelloTo.includes(username),
)

export const selectScrollOffset = createSelector(
  [selectInnerHeight], innerHeight => Math.round(innerHeight - 80),
)

const NO_LAYOUT_TOOLS = [
  /^\/[\w-]+\/post\/.+/,
  /^\/discover\/all\b/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/[\w-]+\/following\b/,
  /^\/[\w-]+\/followers\b/,
]

export const selectIsLayoutToolHidden = createSelector(
  [selectPathname, selectPropsQueryType], (pathname, queryType) => {
    const isUserSearch = queryType === 'users' && /^\/search\b/.test(pathname)
    return isUserSearch || NO_LAYOUT_TOOLS.some(pagex => pagex.test(pathname))
  },
)

