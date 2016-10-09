import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectIsLoggedIn } from './authentication'
import { selectViewNameFromRoute } from './routing'

// state.promotions.xxx
export const selectPromotionsAuthentication = state => get(state, 'promotions.authentication')
export const selectPromotionsLoggedIn = state => get(state, 'promotions.loggedIn')
export const selectPromotionsLoggedOut = state => get(state, 'promotions.loggedOut')

// Memoized selectors
export const selectIsAuthenticationView = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication' || viewName === 'join'
)

export const selectPromotions = createSelector(
  [selectIsLoggedIn, selectPromotionsLoggedIn, selectPromotionsLoggedOut],
  (isLoggedIn, loggedInPromotions, loggedOutPromotions) =>
    (isLoggedIn ? loggedInPromotions : loggedOutPromotions)
)

export const selectCurrentPromotions = createSelector(
  [selectIsAuthenticationView, selectPromotionsAuthentication, selectPromotions],
  (isAuthenticationView, authenticationPromotions, templatePromotions) =>
    (isAuthenticationView ? authenticationPromotions : templatePromotions)
)

