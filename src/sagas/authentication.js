/* eslint-disable no-constant-condition */
import { fork, put, take } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { REHYDRATE } from 'redux-persist/constants'
import {
  AUTHENTICATION,
  PROFILE,
} from 'ello-brains/constants/action_types'
import { getUserCredentials, refreshAuthenticationToken } from 'ello-brains/actions/authentication'

const toMilliseconds = seconds => seconds * 1000

export function* loginSaga() {
  while (true) {
    const { meta, payload } = yield take(AUTHENTICATION.SIGN_IN)
    const { email, password } = payload
    yield put(getUserCredentials(email, password, meta))
  }
}

export function* logoutSaga() {
  const actionTypes = [
    AUTHENTICATION.LOGOUT_SUCCESS,
    AUTHENTICATION.LOGOUT_FAILURE,
    AUTHENTICATION.REFRESH_FAILURE,
  ]
  while (true) {
    yield take(actionTypes)
    document.cookie = 'ello_skip_prerender=false; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    yield put(push('/enter'))
  }
}

function* userSuccessSaga() {
  const actionTypes = [
    AUTHENTICATION.REFRESH_SUCCESS,
    AUTHENTICATION.USER_SUCCESS,
    PROFILE.SIGNUP_SUCCESS,
  ]
  while (true) {
    yield take(actionTypes)
    document.cookie = 'ello_skip_prerender=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
  }
}

function* rehydrateSaga() {
  const { payload } = yield take(REHYDRATE)
  if (payload.authentication) {
    const createdAt = payload.authentication.get('createdAt')
    const expiresIn = payload.authentication.get('expiresIn')
    const refreshToken = payload.authentication.get('refreshToken')

    if (!refreshToken) return

    const now = new Date()
    const expirationDate = new Date(toMilliseconds(createdAt + expiresIn))

    if (expirationDate < now) {
      yield put(refreshAuthenticationToken(refreshToken))
    }
  }
}

export default function* authentication() {
  yield [
    fork(loginSaga),
    fork(logoutSaga),
    fork(rehydrateSaga),
    fork(userSuccessSaga),
  ]
}
