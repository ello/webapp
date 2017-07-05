import { fork } from 'redux-saga/effects'
import requesterSaga from 'ello-brains/sagas/requester'
import analyticsSaga from './analytics'
import authenticationSaga from './authentication'
import pushSubscriptionSaga from './push_subscription'
import uploaderSaga from './uploader'
import { isElloAndroid } from '../lib/jello'

export function* serverRoot() {
  yield [
    fork(requesterSaga),
  ]
}

export default function* root() {
  yield [
    fork(analyticsSaga),
    fork(authenticationSaga),
    fork(requesterSaga),
    fork(uploaderSaga),
  ]
  if (isElloAndroid()) {
    yield fork(pushSubscriptionSaga)
  }
}
