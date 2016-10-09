import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectParamsUsername } from './params'

const POST_DETAIL_EXPRESSION = /^\/[\w\-]+\/post\/.+/

const AUTHENTICATION_ROUTES = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/signup\b/,
]

// props.routing.xxx
export const selectPropsPathname = (state, props) => get(props, 'location.pathname')
export const selectPropsQueryTerms = (state, props) => get(props, 'location.query.terms')
export const selectPropsQueryType = (state, props) => get(props, 'location.query.type')

// state.routing.xxx
export const selectLocation = state => get(state, 'routing.location')
export const selectPreviousPath = state => get(state, 'routing.previousPath')

// state.routing.location.xxx
export const selectPathname = state => get(state, 'routing.location.pathname')

// Memoized selectors
export const selectViewNameFromRoute = createSelector(
  [selectPathname, selectParamsUsername], (pathname, username) => {
    if (/^\/following\b/.test(pathname)) {
      return 'following'
    }
    if (/^\/starred\b/.test(pathname)) {
      return 'starred'
    }
    if (/^\/search\b/.test(pathname)) {
      return 'search'
    }
    if (pathname === '/' || /^\/discover\b/.test(pathname)) {
      return 'discover'
    }
    if (/^\/invitations\b/.test(pathname)) {
      return 'invitations'
    }
    if (/^\/settings\b/.test(pathname)) {
      return 'settings'
    }
    if (/^\/notifications\b/.test(pathname)) {
      return 'notifications'
    }
    if (/^\/onboarding\b/.test(pathname)) {
      return 'onboarding'
    }
    if (POST_DETAIL_EXPRESSION.test(pathname)) {
      return 'postDetail'
    }
    if (/^\/join\b/.test(pathname)) {
      return 'join'
    }
    if (AUTHENTICATION_ROUTES.some(route => route.test(pathname))) {
      return 'authentication'
    }
    // Yo! to get 'userDetail' you have to pass in props... for now
    if (username) {
      return 'userDetail'
    }
    return 'unknown'
  }
)

