import { createSelector } from 'reselect'

// state.authentication.xxx
export const selectAccessToken = state => state.getIn(['authentication', 'accessToken'])
export const selectExpirationDate = state => state.getIn(['authentication', 'expirationDate'])
export const selectIsLoggedIn = state => state.getIn(['authentication', 'isLoggedIn'])
export const selectRefreshToken = state => state.getIn(['authentication', 'refreshToken'])

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

