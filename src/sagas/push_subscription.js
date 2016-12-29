/* eslint-disable no-constant-condition */
import { fork, put, select, take } from 'redux-saga/effects'
import { registerForGCM, unregisterForGCM } from '../actions/profile'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectBundleId, selectRegistrationId } from '../selectors/profile'

export function* loginPushSubscribe() {
  while (true) {
    const action = yield take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
    const { buildVersion, bundleId, marketingVersion, registrationId } = action.payload
    if (yield select(selectIsLoggedIn)) {
      yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
    } else {
      yield take(AUTHENTICATION.USER_SUCCESS)
      yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
    }
  }
}

export function* logoutPushUnsubscribe() {
  while (true) {
    yield take([
      AUTHENTICATION.LOGOUT_SUCCESS,
      AUTHENTICATION.LOGOUT_FAILURE,
      PROFILE.DELETE_SUCCESS,
    ])
    const registrationId = yield select(selectRegistrationId)
    const bundleId = yield select(selectBundleId)
    yield put(unregisterForGCM(registrationId, bundleId))
  }
}

export default function* pushSubscription() {
  yield [
    fork(loginPushSubscribe),
    fork(logoutPushUnsubscribe),
  ]
}

