import { createSelector } from 'reselect'

// state.authentication.xxx
export const selectAccessToken = state => state.authentication.get('accessToken')
export const selectExpirationDate = state => state.authentication.get('expirationDate')
export const selectIsLoggedIn = state => state.authentication.get('isLoggedIn')
export const selectRefreshToken = state => state.authentication.get('refreshToken')

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

