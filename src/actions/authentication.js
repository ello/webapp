import { AUTHENTICATION } from '../constants/action_types'
import {
  loginToken,
  logout as logoutEndpoint,
  forgotPassword,
  refreshAuthToken,
} from '../networking/api'

const clientCredentials = {
  id: ENV.AUTH_CLIENT_ID,
}

export function cancelAuthRefresh() {
  return {
    type: AUTHENTICATION.CANCEL_REFRESH,
  }
}

export function clearAuthStore() {
  return {
    type: AUTHENTICATION.CLEAR_STORE,
  }
}

export function signIn(email, password) {
  return {
    type: AUTHENTICATION.SIGN_IN,
    payload: {
      method: 'POST',
      email,
      password,
    },
  }
}

export function getUserCredentials(email, password, meta) {
  return {
    type: AUTHENTICATION.USER,
    payload: {
      endpoint: loginToken(),
      method: 'POST',
      body: {
        email,
        password,
        grant_type: 'password',
        client_id: clientCredentials.id,
      },
    },
    meta,
  }
}

export function logout() {
  return {
    type: AUTHENTICATION.LOGOUT,
    payload: {
      endpoint: logoutEndpoint(),
      method: 'DELETE',
    },
  }
}

export function refreshAuthenticationToken(refreshToken) {
  return {
    type: AUTHENTICATION.REFRESH,
    payload: {
      endpoint: refreshAuthToken(refreshToken),
      method: 'POST',
      body: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: clientCredentials.id,
      },
    },
  }
}

export function scheduleAuthRefresh(refreshToken, timeout) {
  return {
    type: AUTHENTICATION.SCHEDULE_REFRESH,
    payload: {
      refreshToken,
      timeout,
    },
  }
}

export function sendForgotPasswordRequest(email) {
  return {
    type: AUTHENTICATION.FORGOT_PASSWORD,
    payload: {
      endpoint: forgotPassword(),
      method: 'POST',
      body: {
        email,
      },
    },
  }
}

