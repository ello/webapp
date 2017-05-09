import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectParamsUsername } from './params'

const POST_DETAIL_EXPRESSION = /^\/[\w-]+\/post\/.+/

const AUTHENTICATION_ROUTES = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/signup\b/,
]

// props.routing.xxx
export const selectPropsLocationKey = (state, props) => get(props, 'location.key')
export const selectPropsPathname = (state, props) => get(props, 'location.pathname')
export const selectPropsQueryTerms = (state, props) => get(props, 'location.query.terms')
export const selectPropsQueryType = (state, props) => get(props, 'location.query.type')

// state.routing.xxx
export const selectLocation = state => state.routing.get('location')
export const selectPreviousPath = state => state.routing.get('previousPath')

// state.routing.location.xxx
export const selectPathname = state => state.routing.getIn(['location', 'pathname'])
export const selectQueryTerms = state => state.routing.getIn(['location', 'terms'])
export const selectQueryPreview = state => state.routing.getIn(['location', 'preview'])

// Memoized selectors
export const selectViewNameFromRoute = createSelector(
  [selectPathname, selectParamsUsername], (pathname, username) => {
    if (pathname === '/') {
      return 'editorial'
    }
    if (/^\/following\b/.test(pathname)) {
      return 'following'
    }
    if (/^\/find\b|^\/search\b/.test(pathname)) {
      return 'search'
    }
    if (/^\/discover\b|^\/explore\b/.test(pathname)) {
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
    if (AUTHENTICATION_ROUTES.some(route => route.test(pathname))) {
      return 'authentication'
    }
    // Yo! to get 'userDetail' you have to pass in props... for now
    if (username) {
      return 'userDetail'
    }
    return 'unknown'
  },
)

export const selectIsAuthenticationView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication',
)

export const selectIsOnboardingView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'onboarding',
)

export const selectIsPostDetail = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'postDetail',
)

export const selectIsDiscoverRoot = createSelector(
  [selectPathname], pathname => /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname),
)

