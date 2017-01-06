/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import { LOCATION_CHANGE } from 'react-router-redux'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'
import Session from '../lib/session'

export const initialState = Immutable.Map({
  accessToken: null,
  createdAt: null,
  expirationDate: null,
  expiresIn: null,
  isLoggedIn: false,
  refreshToken: null,
  tokenType: null,
})

export default (state = initialState, action) => {
  let auth
  switch (action.type) {
    case AUTHENTICATION.CLEAR_STORE:
    case PROFILE.DELETE_SUCCESS:
      return initialState
    case AUTHENTICATION.CLEAR_AUTH_TOKEN:
      return state.delete('accessToken').delete('expirationDate').delete('expiresIn')
    case AUTHENTICATION.LOGOUT_SUCCESS:
    case AUTHENTICATION.LOGOUT_FAILURE:
      Session.clear()
      return initialState
    case AUTHENTICATION.USER_SUCCESS:
    case AUTHENTICATION.REFRESH_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
      auth = action.payload.response
      return state.merge({
        ...auth,
        expirationDate: new Date((auth.createdAt + auth.expiresIn) * 1000),
        isLoggedIn: true,
      })
    case LOCATION_CHANGE:
      if (window.nonImmutableState && window.nonImmutableState.authentication) {
        console.log('set auth from non immutable LOCATION_CHANGE')
        state = Immutable.fromJS(JSON.parse(window.nonImmutableState.authentication))
        delete window.nonImmutableState.authentication
        return state
      }
      return state
    case REHYDRATE:
      auth = action.payload.authentication
      if (auth) {
        if (window.nonImmutableState && window.nonImmutableState.authentication) {
          console.log('set auth from non immutable')
          auth = Immutable.fromJS(JSON.parse(window.nonImmutableState.authentication))
          delete window.nonImmutableState.authentication
        }
        return auth.set(
          'expirationDate', new Date((auth.get('createdAt') + auth.get('expiresIn')) * 1000),
        )
      }
      return state
    default:
      return state
  }
}

