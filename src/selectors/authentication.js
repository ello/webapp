import { createSelector } from 'reselect'
import get from 'lodash/get'

// state.authentication.xxx
export const selectAccessToken = state => get(state, 'authentication.accessToken')
export const selectExpirationDate = state => get(state, 'authentication.expirationDate')
export const selectIsLoggedIn = state => state.getIn(['authentication', 'isLoggedIn'])
export const selectRefreshToken = state => get(state, 'authentication.refreshToken')

// Memoized selectors
export const selectShouldUseAccessToken = createSelector(
  selectAccessToken, selectExpirationDate, selectIsLoggedIn,
  (accessToken, expirationDate, isLoggedIn) =>
    isLoggedIn && accessToken && expirationDate > new Date(),
)

export const selectShouldUseRefreshToken = createSelector(
  selectAccessToken, selectExpirationDate, selectIsLoggedIn,
  (accessToken, expirationDate, isLoggedIn) =>
    isLoggedIn && accessToken && !(expirationDate > new Date()),
)

