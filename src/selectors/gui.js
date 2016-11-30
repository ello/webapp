import { createSelector } from 'reselect'
import { selectParamsUsername } from './params'
import { selectPathname, selectPropsQueryType } from './routing'

// state.gui.xxx
export const selectActiveUserFollowingType = state => state.getIn(['gui', 'activeUserFollowingType'])
export const selectActiveNotificationsType = state => state.getIn(['gui', 'activeNotificationsType'])
export const selectColumnCount = state => state.getIn(['gui', 'columnCount'])
export const selectDiscoverKeyType = state => state.getIn(['gui', 'discoverKeyType'])
export const selectHasLaunchedSignupModal = state => state.getIn(['gui', 'hasLaunchedSignupModal'])
export const selectHomeStream = state => state.getIn(['gui', 'homeStream'])
export const selectInnerHeight = state => state.getIn(['gui', 'innerHeight'])
export const selectInnerWidth = state => state.getIn(['gui', 'innerWidth'])
export const selectIsCompleterActive = state => state.getIn(['gui', 'isCompleterActive'])
export const selectIsGridMode = state => state.getIn(['gui', 'isGridMode'])
export const selectIsNavbarHidden = state => state.getIn(['gui', 'isNavbarHidden'])
export const selectIsNotificationsActive = state => state.getIn(['gui', 'isNotificationsActive'])
export const selectIsNotificationsUnread = state => state.getIn(['gui', 'isNotificationsUnread'])
export const selectIsProfileMenuActive = state => state.getIn(['gui', 'isProfileMenuActive'])
export const selectIsTextToolsActive = state => state.getIn(['gui', 'isTextToolsActive'])
export const selectLastNotificationCheck = state => state.getIn(['gui', 'lastNotificationCheck'])
export const selectLastDiscoverBeaconVersion = state => state.getIn(['gui', 'lastDiscoverBeaconVersion']) // eslint-disable-line
export const selectLastFollowingBeaconVersion = state => state.getIn(['gui', 'lastFollowingBeaconVersion']) // eslint-disable-line
export const selectLastStarredBeaconVersion = state => state.getIn(['gui', 'lastStarredBeaconVersion'])
export const selectSaidHelloTo = state => state.getIn(['gui', 'saidHelloTo'])
export const selectTextToolsCoordinates = state => state.getIn(['gui', 'textToolsCoordinates'])
export const selectTextToolsStates = state => state.getIn(['gui', 'textToolsStates'])

// Memoized selectors
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

