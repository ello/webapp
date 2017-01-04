/* eslint-disable no-constant-condition */
import { delay } from 'redux-saga'
import { call, cancel, fork, put, take } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { REHYDRATE } from 'redux-persist/constants'

import {
  AUTHENTICATION,
  PROFILE,
} from '../constants/action_types'

import {
  cancelAuthRefresh,
  clearAuthStore,
  getUserCredentials,
  refreshAuthenticationToken,
  scheduleAuthRefresh,
} from '../actions/authentication'

const toMilliseconds = seconds => seconds * 1000

// Get a timeout value about 100ms before a given date,
// or at least not in the past
const futureTimeout = (time) => {
  let msFromNow = time - new Date()

  // Establish a lead time of 100ms before expiration date
  msFromNow -= 100

  // Let's not set a timeout for in the past
  return Math.max(msFromNow, 0)
}

export function* loginSaga() {
  while (true) {
    const { meta, payload } = yield take(AUTHENTICATION.SIGN_IN)
    const { email, password } = payload
    yield put(clearAuthStore())
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
    document.cookie = 'ello_skip_prerender=false'
    yield put(cancelAuthRefresh())
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
    const action = yield take(actionTypes)
    const { payload } = action
    document.cookie = 'ello_skip_prerender=true; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    yield put(scheduleAuthRefresh(
      payload.response.refreshToken,
      toMilliseconds(7100),
    ))
  }
}

function* scheduleRefreshTokenSaga(action) {
  const { payload: { refreshToken, timeout } } = action
  yield call(delay, timeout)
  yield put(refreshAuthenticationToken(refreshToken))
}

/* Schedules a new token refresh.
   If one is already scheduleded, cancel it and
   reschedule */
function* refreshSchedulerSaga() {
  let refreshTask
  while (true) {
    const action = yield take([
      AUTHENTICATION.CANCEL_REFRESH,
      AUTHENTICATION.SCHEDULE_REFRESH,
    ])

    if (refreshTask) {
      yield cancel(refreshTask)
    }

    if (action.type === AUTHENTICATION.SCHEDULE_REFRESH) {
      refreshTask = yield fork(scheduleRefreshTokenSaga, action)
    }
  }
}

/* Fires off or schedules a token refresh upon
   rehydration, then exits. */
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
    } else {
      const newTimeout = futureTimeout(expirationDate)

      yield put(scheduleAuthRefresh(refreshToken, newTimeout))
    }
  }
}

export default function* authentication() {
  yield [
    fork(loginSaga),
    fork(logoutSaga),
    fork(rehydrateSaga),
    fork(refreshSchedulerSaga),
    fork(userSuccessSaga),
  ]
}
