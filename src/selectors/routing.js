import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectParamsUsername } from './params'

const POST_DETAIL_EXPRESSION = /^\/[\w\-]+\/post\/.+/

// props.routing.xxx
export const selectPropsPathname = (state, props) => get(props, 'location.pathname')
export const selectPropsQueryTerms = (state, props) => get(props, 'location.query.terms')
export const selectPropsQueryType = (state, props) => get(props, 'location.query.type')

// state.routing.xxx
export const selectLocation = (state) => get(state, 'routing.location')
export const selectPreviousPath = (state) => get(state, 'routing.previousPath')

// state.routing.location.xxx
export const selectPathname = (state) => get(state, 'routing.location.pathname')

// Memoized selectors
export const selectViewNameFromRoute = createSelector(
  [selectPathname, selectParamsUsername], (pathname, username) => {
    if (/^\/following/.test(pathname)) {
      return 'following'
    }
    if (/^\/starred/.test(pathname)) {
      return 'starred'
    }
    if (/^\/search/.test(pathname)) {
      return 'search'
    }
    if (pathname === '/' || /^\/discover/.test(pathname)) {
      return 'discover'
    }
    if (/^\/invitations/.test(pathname)) {
      return 'invitations'
    }
    if (/^\/settings/.test(pathname)) {
      return 'settings'
    }
    if (/^\/notifications/.test(pathname)) {
      return 'notifications'
    }
    if (POST_DETAIL_EXPRESSION.test(pathname)) {
      return 'postDetail'
    }
    // Yo! to get 'userDetail' you have to pass in props... for now
    if (username) {
      return 'userDetail'
    }
    return 'unknown'
  }
)
