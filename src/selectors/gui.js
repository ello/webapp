import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectParamsUsername } from './params'
import { selectPathname, selectPropsQueryType } from './routing'

// state.gui.xxx
export const selectActiveUserFollowingType = state => get(state, 'gui.activeUserFollowingType')
export const selectActiveNotificationsType = state => get(state, 'gui.activeNotificationsType')
export const selectColumnCount = state => get(state, 'gui.columnCount')
export const selectDiscoverKeyType = state => get(state, 'gui.discoverKeyType')
export const selectHomeStream = state => get(state, 'gui.homeStream')
export const selectInnerHeight = state => get(state, 'gui.innerHeight')
export const selectInnerWidth = state => get(state, 'gui.innerWidth')
export const selectIsCompleterActive = state => get(state, 'gui.isCompleterActive')
export const selectIsGridMode = state => get(state, 'gui.isGridMode')
export const selectIsNavbarHidden = state => get(state, 'gui.isNavbarHidden')
export const selectIsNotificationsActive = state => get(state, 'gui.isNotificationsActive')
export const selectIsNotificationsUnread = state => get(state, 'gui.isNotificationsUnread')
export const selectIsProfileMenuActive = state => get(state, 'gui.isProfileMenuActive')
export const selectIsTextToolsActive = state => get(state, 'gui.isTextToolsActive')
export const selectLastNotificationCheck = state => get(state, 'gui.lastNotificationCheck')
export const selectLastDiscoverBeaconVersion = state => get(state, 'gui.lastDiscoverBeaconVersion') // eslint-disable-line
export const selectLastFollowingBeaconVersion = state => get(state, 'gui.lastFollowingBeaconVersion') // eslint-disable-line
export const selectLastStarredBeaconVersion = state => get(state, 'gui.lastStarredBeaconVersion')
export const selectSaidHelloTo = state => get(state, 'gui.saidHelloTo')
export const selectTextToolsCoordinates = state => get(state, 'gui.textToolsCoordinates')
export const selectTextToolsStates = state => get(state, 'gui.textToolsStates')

// Memoized selectors

// TODO: Add Test
export const selectDeviceSize = createSelector(
  [selectColumnCount, selectInnerWidth], (columnCount, innerWidth) => {
    // deviceSize could be anything: baby, momma, poppa bear would work too.
    if (columnCount >= 4) {
      return 'desktop'
    } else if (columnCount >= 2 && innerWidth >= 640) {
      return 'tablet'
    }
    return 'mobile'
  }
)

export const selectIsMobile = createSelector(
  [selectDeviceSize], deviceSize =>
    deviceSize === 'mobile'
)

export const selectIsMobileGridStream = createSelector(
  [selectDeviceSize, selectIsGridMode], (deviceSize, isGridMode) =>
    deviceSize === 'mobile' && isGridMode
)

// TODO: Add Test
export const selectPaddingOffset = createSelector(
  [selectDeviceSize, selectColumnCount], (deviceSize, columnCount) => {
    if (deviceSize === 'mobile') { return 10 }
    return columnCount >= 4 ? 40 : 20
  }
)

export const selectCommentOffset = createSelector(
  [selectDeviceSize], deviceSize =>
    (deviceSize === 'mobile' ? 40 : 60)
)

// TODO: Add Test
export const selectColumnWidth = createSelector(
  [selectColumnCount, selectInnerWidth, selectPaddingOffset], (columnCount, innerWidth, padding) =>
    Math.round((innerWidth - ((columnCount + 1) * padding)) / columnCount)
)

// TODO: Add Test
export const selectContentWidth = createSelector(
  [selectInnerWidth, selectPaddingOffset], (innerWidth, padding) =>
    Math.round(innerWidth - (padding * 2))
)

// TODO: Add Test
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
  }
)

export const selectHasSaidHelloTo = createSelector(
  [selectSaidHelloTo, selectParamsUsername], (saidHelloTo, username) =>
    saidHelloTo.indexOf(username) !== -1
)

export const selectScrollOffset = createSelector(
  [selectInnerHeight], innerHeight => Math.round(innerHeight - 80)
)

// TODO: Move to routing constants
const NO_LAYOUT_TOOLS = [
  /^\/[\w\-]+\/post\/.+/,
  /^\/discover\/all\b/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/[\w\-]+\/following\b/,
  /^\/[\w\-]+\/followers\b/,
]

// TODO: Add Test
export const selectIsLayoutToolHidden = createSelector(
  [selectPathname, selectPropsQueryType], (pathname, queryType) => {
    const isUserSearch = queryType === 'users' && /^\/search\b/.test(pathname)
    return isUserSearch || NO_LAYOUT_TOOLS.some(pagex => pagex.test(pathname))
  }
)

