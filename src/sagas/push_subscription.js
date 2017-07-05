/* eslint-disable no-constant-condition */
import { fork, put, select, take } from 'redux-saga/effects'
import { AUTHENTICATION, PROFILE } from 'ello-brains/constants/action_types'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectBundleId, selectIsStaff, selectRegistrationId } from 'ello-brains/selectors/profile'
import { registerForGCM, unregisterForGCM } from 'ello-brains/actions/profile'
import * as ElloAndroidInterface from '../lib/android_interface'

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
    const isStaff = yield select(selectIsStaff)
    ElloAndroidInterface.setIsStaff(isStaff)
  }
}

export function* logoutPushUnsubscribe() {
  while (true) {
    yield take([
      AUTHENTICATION.LOGOUT_SUCCESS,
      AUTHENTICATION.LOGOUT_FAILURE,
      AUTHENTICATION.REFRESH_FAILURE,
      PROFILE.DELETE_SUCCESS,
    ])
    const registrationId = yield select(selectRegistrationId)
    const bundleId = yield select(selectBundleId)
    if (registrationId && bundleId) {
      yield put(unregisterForGCM(registrationId, bundleId))
    }
    ElloAndroidInterface.setIsStaff(false)
  }
}

export default function* pushSubscription() {
  yield [
    fork(loginPushSubscribe),
    fork(logoutPushUnsubscribe),
  ]
}

